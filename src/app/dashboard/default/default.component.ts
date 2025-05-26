import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('Default Component Initialized');
    this.setupButtonListeners(); // 버튼 이벤트 초기화
  }

  // 이미지 업로드 → 추론 요청
  uploadImage(imageFile: File): void {
    const apiUrl = 'https://your-api-endpoint.com/infer'; // 실제 API 엔드포인트로 변경
    const formData = new FormData();
    formData.append('image', imageFile);

    this.http.post(apiUrl, formData).subscribe(
      (response: any) => {
        this.displayResults(response); // 추론 결과 표시
      },
      (error) => {
        console.error('Error during inference:', error);
      }
    );
  }

  // 데모 데이터 → S3 전송 및 추론
  uploadDemoData(): void {
    const apiUrl = 'https://your-api-endpoint.com/demo'; // 실제 API 엔드포인트로 변경
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        console.log('Demo data processed:', response);
        this.displayResults(response); // 추론 결과 표시
      },
      (error) => {
        console.error('Error during demo data processing:', error);
      }
    );
  }

  // 결과 표시
  displayResults(response: any): void {
    // DOM 요소 가져오기
    const realTimeImage = document.getElementById('realTimeImage') as HTMLImageElement;
    const inferenceImage = document.getElementById('inferenceImage') as HTMLImageElement;
    const okButton = document.getElementById('okButton') as HTMLButtonElement;
    const ngButton = document.getElementById('ngButton') as HTMLButtonElement;
    const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;

    // 기본 스타일 초기화
    okButton.style.backgroundColor = '#414141';
    ngButton.style.backgroundColor = '#414141';
    statusMessage.innerText = '결과를 기다리는 중...';

    try {
      // 실시간 이미지 URL 설정
      if (response.realTimeImageUrl) {
        realTimeImage.src = response.realTimeImageUrl;
      } else {
        realTimeImage.src = ''; // 기본값 처리
        console.warn('실시간 이미지 URL이 없습니다.');
      }

      // 추론 이미지 URL 설정
      if (response.inferenceImageUrl) {
        inferenceImage.src = response.inferenceImageUrl;
      } else {
        inferenceImage.src = ''; // 기본값 처리
        console.warn('추론 이미지 URL이 없습니다.');
      }

      // 양불 상태 처리
      if (response.status === 'OK') {
        okButton.style.backgroundColor = '#1AA13A'; // OK 버튼 활성화
        statusMessage.innerText = '이 두부는 정상입니다.';
      } else if (response.status === 'NG') {
        ngButton.style.backgroundColor = '#FF4141'; // NG 버튼 활성화
        statusMessage.innerText = '이 두부는 불량입니다.';
      } else {
        // 알 수 없는 상태 처리
        statusMessage.innerText = '알 수 없는 상태입니다.';
        console.warn('알 수 없는 상태:', response.status);
      }
    } catch (error) {
      // 오류 처리
      console.error('결과를 표시하는 중 오류가 발생했습니다:', error);
      statusMessage.innerText = '결과를 로드하는 중 문제가 발생했습니다.';
    }
  }

  // 버튼 클릭 이벤트 설정
  setupButtonListeners(): void {
    const okButton = document.getElementById('okButton') as HTMLButtonElement;
    const ngButton = document.getElementById('ngButton') as HTMLButtonElement;

    // OK 버튼 클릭 이벤트
    okButton.addEventListener('click', () => {
      this.setButtonStatus('OK');
    });

    // NG 버튼 클릭 이벤트
    ngButton.addEventListener('click', () => {
      this.setButtonStatus('NG');
    });
  }

  // 버튼 상태 설정
  private setButtonStatus(status: 'OK' | 'NG'): void {
    const okButton = document.getElementById('okButton') as HTMLButtonElement;
    const ngButton = document.getElementById('ngButton') as HTMLButtonElement;
    const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;

    if (status === 'OK') {
      okButton.style.backgroundColor = '#1AA13A'; // OK 버튼 활성화
      ngButton.style.backgroundColor = '#414141'; // NG 버튼 비활성화
      statusMessage.innerText = '이 두부는 정상입니다.';
    } else if (status === 'NG') {
      ngButton.style.backgroundColor = '#FF4141'; // NG 버튼 활성화
      okButton.style.backgroundColor = '#414141'; // OK 버튼 비활성화
      statusMessage.innerText = '이 두부는 불량입니다.';
    }
  }
}


