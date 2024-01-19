<img  src="https://github.com/Emin-G/Img/blob/main/buzzk/buzzk_pamplet.gif?raw=true" alt="BuzzkThumb" width="100%">

#  뿌지직

<p align="center">
<img  src="https://github.com/Emin-G/Img/blob/main/buzzk/buzzk_favi-min.png?raw=true" alt="BUZZK" width="30%">
</p>

<p align="center">
뿌지직은 치지직 챗봇을 더욱 쉽게 개발할 수 있도록 돕는 비공식 라이브러리 입니다.
</p>
<p align="center">
챗봇 개발에 초점이 맞춰저 있어, 여러 계정에 동시 로그인할 수 없습니다.
</p>

---

##  설치

1. 이 레포지토리를 다운받아 프로젝트 폴더 안에 넣어주세요.
2. 폴더 이름을 `buzzk-master` 에서 `buzzk` 으로 변경해주세요.
3.  `const buzzk = require("./buzzk");`

##  빠른. 시작.

    const buzzk = require("./buzzk");
    buzzk.login("NID_AUT 쿠키 값", "NID_SES 쿠키 값");
    
    const buzzkChat = buzzk.chat;
    
    async function test () {
    
        let chSearch = await buzzk.channel.getChannel("녹두로로"); //채널 검색
        
        let channel = chSearch[0]; //검색 결과 첫번째 채널
    
        const lvDetail = await buzzk.live.getLiveDetail(channel.channelID); //현재 방송 정보
    
        let chat = new buzzkChat(channel.channelID);
        await chat.connect(); //채팅창 연결
    
        let recentChat = await chat.getRecentChat(); //최근 채팅 가져오기 (기본값 50개)
        console.log(recentChat);
    
        chat.onMessage((data) => { //채팅이 왔을 때
            for (let o in data) {
                console.log(data[o].message);

				if (data[o].message === "!ping") await chat.send("pong!");
				//채팅 보내기 (login 후에만 가능)
            }
        });
        
    }
    
    test();

##  사용법

> login

    buzzk.login("NID_AUT 쿠키 값", "NID_SES 쿠키 값");

dotenv와 함께 사용하는 것을 매우 권장합니다.

    buzzk.login(process.env.NID_AUT, process.env.NID_SES);

---

> channel

    let chSearch = await buzzk.channel.getChannel("녹두로로");
    console.log(chSearch);

<details>
<summary>Return 값 보기</summary>

 - Return
	 - channelID
	 - name
	 - description
	 - follower
	 - imageURL
	 - isLive

</details>

---

> live

    const lvDetail = await buzzk.live.getLiveDetail("channelID 값");
    console.log(lvDetail);

<details>
<summary>Return 값 보기</summary>

 - Return
	 - channelID
	 - channel
	 - chatID
	 - userCount
		 - now
		 - total
	 - title
	 - startOn
	 - closeOn
	 - status
	 - polling

</details>

    const lvStatus = await buzzk.live.getLiveStatus("channelID 값");
    console.log(lvStatus);

<details>
<summary>Return 값 보기</summary>

 - Return
	 - channelID
	 - chatID
	 - userCount
		 - now
		 - total
	 - title
	 - status
	 - polling

</details>

---

> chat

    const buzzkChat = buzzk.chat;
    let chat = new buzzkChat("channelID 값");
    await chat.connect(); //채팅창 연결

>

    let recentChat = await chat.getRecentChat(갯수); //최근 채팅 가져오기 (기본값 50개)
    console.log(recentChat);

<details>
<summary>Return 값 보기</summary>

 - Return
	 - 0
		 - author
			 - id
			 - name
			 - imageURL
		 - message
		 - time
	 - 1
	 - 2
	 - 3
	 - ...

</details>

    chat.onMessage((data) => { //채팅이 왔을 때
    	console.log(data);
    
	    for (let o in data) {
	        console.log(data[o].message); //메세지만 전부 꺼내기
        }
    });

<details>
<summary>Return 값 보기</summary>

 - Return
	 - 0
		 - author
			 - id
			 - name
			 - imageURL
		 - message
		 - time
	 - 1
	 - 2
	 - 3
	 - ...

</details>

    await chat.send("ㅋㅋㅋㅋㅋㅋ"); //채팅 보내기 (login 후에만 가능)

> 

    chat.disconnect(); //채팅창 연결 끊기
