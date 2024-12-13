import torch
from torchvision import models, transforms
from PIL import Image
import io
import base64
import json

# 모델 로드
def model_fn(model_dir):
    model = models.resnet18(pretrained=False)
    model.fc = torch.nn.Linear(512, 5)  # 클래스 개수를 5로 수정
    model.load_state_dict(torch.load(f"{model_dir}/model.pth", map_location=torch.device("cpu")))
    model.eval()
    return model

# 입력 데이터 처리
def input_fn(request_body, request_content_type):
    if request_content_type == "application/json":
        # JSON 디코딩
        request_data = json.loads(request_body)
        # Base64 디코딩
        image_bytes = io.BytesIO(base64.b64decode(request_data["image"]))
        img = Image.open(image_bytes).convert("RGB")
        transform = transforms.Compose([
            transforms.Resize((640, 640)),  # 학습 시 사용한 크기로 변경
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        return transform(img).unsqueeze(0)  # 배치 차원을 추가
    else:
        raise ValueError(f"Unsupported content type: {request_content_type}")

# 추론 로직
def predict_fn(input_data, model):
    with torch.no_grad():
        output = model(input_data)
        _, predicted = torch.max(output, 1)  # 가장 높은 확률의 클래스 선택
    return {"class_id": predicted.item()}
