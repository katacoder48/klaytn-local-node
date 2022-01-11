## Klaytn Local Test Node

### Objective

> 간단한 클레이튼 로컬 노드 

클레이튼 로컬 테스트를 위한 리파짓토리로, [klaytn/local-klaytn-deploy](https://github.com/klaytn/local-klaytn-deploy) 을 기반으로 작성되었습니다.

`http://localhost:8551`로 자유롭게 접근가능한 테스트용 로컬 노드를 오픈합니다.

<img width="345" alt="스크린샷 2022-01-12 오전 2 15 23" src="https://user-images.githubusercontent.com/96544148/148989962-ae059baf-9046-4732-b3b9-e60edd4826c4.png">



### Usage

#### 1. 로컬 노드 시작

`http://localhost:8551`으로 접근가능한 로컬 노드를 오픈합니다.


````shell
yarn start
````

#### 2. 100 Klay씩 받은 계정 생성하기

`./privateKeys.js`에 100klay를 받는 10개의 비밀키가 생성됩니다. 지갑에 연동하거나, 해당 계정을 이용해서 테스트 스마트 컨트랙트를 배포할 수 있습니다.

````shell
yarn accounts
````

#### 3. 로그 확인

로컬 노드에 대한 로그 정보를 생성합니다.

````shell
yarn log
````

#### 4. 로컬 노드 종료

로컬 노드를 종료합니다. 

````shell
yarn stop
````
