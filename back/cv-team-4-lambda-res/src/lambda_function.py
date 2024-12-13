import json
import boto3
import base64
import time

# SageMaker 설정
ENDPOINT_NAME = "team4-resnet-endpoint"

# SageMaker Runtime 클라이언트 생성
runtime = boto3.client('runtime.sagemaker')

# Base64 패딩을 자동으로 추가하는 함수
def fix_base64_padding(base64_string):
    # 패딩이 부족한 경우 "="을 추가
    missing_padding = len(base64_string) % 4
    if missing_padding:
        base64_string += '=' * (4 - missing_padding)
    return base64_string

# 데이터 URI 스키마 제거 함수
def remove_data_uri_scheme(base64_string):
    if "," in base64_string:
        return base64_string.split(",")[1]  # "data:image/png;base64," 이후의 순수 데이터 반환
    return base64_string

def lambda_handler(event, context):
    try:
        start_time = time.time()
        # 요청에서 이미지 데이터 추출
        body = event["body"]
        body_json = json.loads(body)
        payload = body_json["image"]
        
        # 이미지 데이터가 없을 경우 처리
        if not payload:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'No image data provided'})
            }
        
        # 디버깅을 위한 로깅 (수신한 base64 문자열 확인)
        print(f"Received Base64 Payload: {payload[:100]}...")  # 처음 100자만 로깅
        
        # 데이터 URI 스키마 제거
        payload = remove_data_uri_scheme(payload)
        print(f"Base64 Without Data URI Scheme: {payload[:100]}...")  # 수정된 base64 문자열 확인
        
        # Base64 패딩 수정
        payload = fix_base64_padding(payload)
        print(f"Fixed Base64 Payload: {payload[:100]}...")  # 패딩 수정 후 데이터 확인
        
        # Base64 디코딩
        image_binary = base64.b64decode(payload)
        
        # SageMaker Endpoint로 요청 전송
        response = runtime.invoke_endpoint(
            EndpointName=ENDPOINT_NAME,
            ContentType="application/json",
            Body=json.dumps({'image': payload})  # 순수 Base64 데이터를 전달
        )
        
        # SageMaker 결과 처리
        result = json.loads(response['Body'].read().decode())
        print(f"SageMaker Response: {result}")
        end_time = time.time()
        response_time_ms = (end_time - start_time) * 1000

        # 결과값 반환
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Prediction successful',
                'result': result,
                'response_time_ms': round(response_time_ms, 2)
            })
        }
    
    except Exception as e:
        # 예외 처리 및 로그 출력
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error during processing', 'error': str(e)})
        }
