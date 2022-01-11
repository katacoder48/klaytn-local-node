## Klaytn Local Test Node

### Objective

> 간단한 클레이튼 로컬 노드 

클레이튼 로컬 테스트를 위한 리파짓토리로, [klaytn/local-klaytn-deploy](https://github.com/klaytn/local-klaytn-deploy) 을 기반으로 작성되었습니다.



### Usage

#### 1. 로컬 노드 시작

````shell
yarn start
````

#### 2. 100 Klay씩 받은 계정 생성하기

`./privateKeys.js`에 100klay를 받는 10개의 비밀키가 생성됩니다.

````shell
yarn accounts
````

#### 3. 로그 확인

````shell
yarn log
````

#### 4. 로컬 노드 종료

````shell
yarn stop
````