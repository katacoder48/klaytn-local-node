import * as fs from 'fs';
import Caver from 'caver-js';
import axios from 'axios';

const PRIVATE_KEY_PATH = "./privateKeys.json";
const NODE_URL = "http://localhost:8551"

/**
 * Klaytn Node 참여자의 public address 가져오기
 */
async function readFundAddress() {
    const res = await axios.post(NODE_URL, {
        jsonrpc : "2.0",
        method : "personal_listAccounts",
        params : [],
        id : "1"
    });

    if (res.status != 200) {
        throw new Error(`클레이튼 노드(${NODE_URL})의 접근이 유효하지 않습니다.`)
    }

    if (!res.data || !res.data.result) {
        console.error("res.data : \n",res.data)
        throw new Error(`노드 호출(personal_listAccounts)에 오류가 발생했습니다. ${res.data}`)
    }

    const addresses: string[] = res.data.result;
    if (addresses.length == 0) {
        console.error(`노드 호출 시 현재 Person Account가 조회되지 않습니다. 잠시 후 다시 호출해 주세요.`)
    }

    return addresses[0]
}

/**
 * Klaytn Node 참여자의 펀드에서 돈 가져오기
 */
async function unlockFund(account:string, fundAmount:string|number) {
    const res = await axios.post(NODE_URL, {
        jsonrpc : "2.0",
        method : "personal_unlockAccount",
        params : [account,"",fundAmount],
        id : "1"
    });

    if (res.status != 200) {
        throw new Error(`클레이튼 노드(${NODE_URL})의 접근이 유효하지 않습니다.`)
    }

    if (!res.data || !res.data.result) {
        console.error("res.data : \n",res.data)
        throw new Error(`노드 호출(personal_unlockAccount)에 오류가 발생했습니다. ${res.data}`)
    }
}

/**
 * 테스트 계정 만들기
 */
async function readOrCreateTestAddresses() {
    const caver = new Caver(NODE_URL);
    let privateKeys = [];

    if (!fs.existsSync(PRIVATE_KEY_PATH)) {
        for(var i = 0; i < 10; i++) {
            // @ts-ignore
            const p = caver.wallet.keyring.generate()
            privateKeys.push(p.key.privateKey)
        }
        fs.writeFileSync(PRIVATE_KEY_PATH, JSON.stringify(privateKeys))
    } else {
        const jsonFile = fs.readFileSync(PRIVATE_KEY_PATH,'utf8');
        privateKeys = JSON.parse(jsonFile);
    }

    // get public address from private Key
    return privateKeys.map((privateKey:string) => {
        const account = caver.klay.accounts.privateKeyToAccount(privateKey);
        return account.address;
    })
}

/**
 * Fund로부터 receiverAddress로 돈 가져오기
 *
 * @param receiverAddress : 돈 받을 계좌
 * @param fundAddress     : 돈 줄 계좌
 */
async function receiveFund(receiverAddress:string, fundAddress:string, amount:number) {
    const caver = new Caver(NODE_URL);

    console.log(`=> ${receiverAddress} : ${amount} Klay 수령`)
    const transaction = new caver.transaction.valueTransfer({
        from: fundAddress,
        to: receiverAddress,
        value: caver.utils.toPeb(amount, "KLAY"),
        gas: 25000
    })

    await caver.rpc.klay.sendTransaction(transaction)
}

(async () => {
    const address = process.argv.slice(2)[0]
    if (!Caver.utils.isAddress(address)) {
        throw new Error("첫번째 argument로 주소가 들어와야 합니다.")
    }
    const amount = parseInt(process.argv.slice(2)[1])

    // 1. read the address of fund (local network)
    const fundAddress = await readFundAddress();

    // 2. unlock the Fund
    await unlockFund(fundAddress, 99999999);

    // 3. receive Fund per TestAddresses
    console.log(`FUND ADDRESS : ${fundAddress} 에서 ${address}로 ${amount} 클레이 배분`)
    await receiveFund(address, fundAddress, amount);
})();