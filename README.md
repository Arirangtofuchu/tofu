# tofu
AWS AINATION 컴퓨팅 비전 프로젝트(2024.11)
두부 결함 탐지 프로젝트

## 브랜치 분할
- back : aws 인프라 소스코드
  - cv-team-4-lambda-res: resnet 모델 lambda
    - src/lambda_function.py: 모델 연결용 람다 함수
    - template.yml: 설정값
  - cv-team-4-lambda3: efficientnet 모델 lambda 
    - src/lambda_function.py: 모델 연결용 람다 함수
    - template.yml: 설정값
    
- front : 프론트엔드
  - angular 빌드 파일 

- model : 모델
  - renet
    - Resnet.ipynb: resnet class detect 학습 파일
    - resnet_deploy.ipynb: sagemaker endpoint 생성 파일
    - inference.py

## 팀원
- 김효정(팀장) : 모델링, AWS 인프라
- 김진솔 : 모델링, 프론트엔드
- 신혜정 : 프론트엔드, AWS 인프라
- 이지은 : AWS 인프라, 프론트엔드
- 유현지 : 모델링, AWS 인프라
