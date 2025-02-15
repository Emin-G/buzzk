<img src="https://github.com/Emin-G/Img/blob/main/buzzk/buzzk_pamplet.gif?raw=true" alt="BuzzkThumb" width="100%">

#  뿌지직

<p align="center">
<img src="https://github.com/Emin-G/Img/blob/main/buzzk/buzzk_favi-min.png?raw=true" alt="BUZZK" width="30%">
</p>

<p align="center">
뿌지직은 치지직 챗봇을 더욱 쉽게 개발할 수 있도록 돕는 비공식 라이브러리 입니다.
</p>
<p align="center">
챗봇 개발에 초점이 맞춰저 있어, 여러 계정에 동시 로그인할 수 없습니다.
</p>

---

##  📖 업데이트 내역

 ### 🎉 2.0 업데이트
 - 공식 API를 일부 지원하기 시작했어요!

> [!CAUTION]
> 이 버전 이후부터는 공식 API와 비공식 API를 혼용하여 사용합니다.
> 공식 API로 대체 가능한 기능은 모두 공식 API를 이용할 예정입니다.

> [!WARNING]
> * 비공식 API 전용 모듈은 더 이상 지원되지 않습니다.
> * 비공식 API로만 이루어진 모듈을 사용하시려면
> `npm install buzzk@1.11.3`

##  ✒️ 마이그레이션 가이드 (v.1.x -> v.2.0.0)

<details>
<summary>펼쳐보기</summary>

	buzzk.oauth

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | 추가 |
|--|--|
|  | buzzk.oauth.get |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | 추가 |
|--|--|
|  | buzzk.oauth.refresh |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | 추가 |
|--|--|
|  | buzzk.channel.resolve |

---

	buzzk.channel.get

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | (return).channel.description |
|--|--|

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | (return).channel.isLive |
|--|--|

</details>

##  👋 설치

1. `npm install buzzk`
2. `const buzzk = require("buzzk");`

##  🔥 빠른. 시작.

    const buzzk = require("buzzk");
	buzzk.auth("ClientID 값", "ClientSecret 값");
    buzzk.login("NID_AUT 쿠키 값", "NID_SES 쿠키 값");
    
    const buzzkChat = buzzk.chat;
    
    async function test () {
    
        let chSearch = await buzzk.channel.search("녹두로로"); //채널 검색
        
        let channel = chSearch[0]; //검색 결과 첫번째 채널
    
        const lvDetail = await buzzk.live.getDetail(channel.channelID); //현재 방송 정보
    
        let chat = new buzzkChat(channel.channelID);
        await chat.connect(); //채팅창 연결
    
        let recentChat = await chat.getRecentChat(); //최근 채팅 가져오기 (기본값 50개)
        console.log(recentChat);
    
        chat.onMessage(async (data) => { //채팅이 왔을 때
            for (let o in data) {
                console.log(data[o].message);

				if (data[o].message === "!ping") await chat.send("pong!");
				//채팅 보내기 (login 후에만 가능)

				let userInfo = await chat.getUserInfo(data[o].author.id);
            	console.log(userInfo);
				//채팅 보낸 유저의 정보
            }
        });

		chat.onDisconnect(async () => { //채팅창 연결이 끊겼을 때
			//TODO
    	});
        
    }
    
    test();

##  🎀 사용법

###  auth

✅ Official API

    buzzk.auth("ClientID 값", "ClientSecret 값");

https://developers.chzzk.naver.com/application
네이버 치지직 개발자 센터에서 등록 후 사용 가능합니다.
✅ Official API 표기가 있는 모든 함수에서 사용됩니다.

dotenv와 함께 사용하는 것을 매우 권장합니다.

    buzzk.auth(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

---

###  login

    buzzk.login("NID_AUT 쿠키 값", "NID_SES 쿠키 값");

dotenv와 함께 사용하는 것을 매우 권장합니다.

    buzzk.login(process.env.NID_AUT, process.env.NID_SES);

---

###  oauth

✅ Official API

    let oauth = await buzzk.oauth.get("Code 값");
    console.log(oauth);

<details>
<summary>return</summary>

 - Return
	 - access
	 - refresh
	 - expireIn

</details>

✅ Official API

    let oauth = await buzzk.oauth.refresh("accessToken 값");
    console.log(oauth);

<details>
<summary>return</summary>

 - Return
	 - access
	 - refresh
	 - expireIn

</details>

✅ Official API

    let oauth = await buzzk.oauth.resolve("accessToken 값");
    console.log(oauth);

<details>
<summary>return</summary>

 - Return
	 - channelID
	 - name
	 - follower
	 - imageURL

</details>

---

###  channel

    let chSearch = await buzzk.channel.search("녹두로로");
    console.log(chSearch);

<details>
<summary>return</summary>

 - Return
	 - 0
		- channelID
		- name
		- description
		- follower
		- imageURL
		- isLive
	 - 1
	 - 2
	 - 3
	 - ...

</details>

✅ Official API

    let channel = await buzzk.channel.get("channelID 값");
    console.log(channel);

<details>
<summary>return</summary>

 - Return
	 - channelID
	 - name
	 - follower
	 - imageURL

</details>

    await buzzk.channel.follow("channelID 값");

>

    await buzzk.channel.unFollow("channelID 값");

---

###  live

    const lvDetail = await buzzk.live.getDetail("channelID 값");
    console.log(lvDetail);

<details>
<summary>return</summary>

 - Return
	 - channelID
	 - channel
		 - name
		 - imageURL
	 - chatID
	 - chatLimit //팔로워 전용 채팅 등...
	 - userCount
		 - now
		 - total
	 - title
	 - category
	 - startOn
	 - closeOn
	 - status
	 - polling
	 - liveID
	 - videoID

</details>

    const lvStatus = await buzzk.live.getStatus("channelID 값");
    console.log(lvStatus);

<details>
<summary>return</summary>

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

###  chat

    const buzzkChat = buzzk.chat;
    let chat = new buzzkChat("channelID 값");
    await chat.connect(); //채팅창 연결

>

    let recentChat = await chat.getRecentChat(갯수); //최근 채팅 가져오기 (기본값 50개)
    console.log(recentChat);

<details>
<summary>return</summary>

 - Return
	 - 0
		 - author
			 - id
			 - name
			 - imageURL
			 - hasMod //관리 권한을 가졌는지 (false / true)
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
<summary>callback</summary>

 - Return
	 - 0
		 - author
			 - id
			 - name
			 - imageURL
			 - hasMod //관리 권한을 가졌는지 (false / true)
		 - message
		 - time
	 - 1
	 - 2
	 - 3
	 - ...

</details>

    chat.onDonation((data) => { //도네이션이 왔을 때
    	console.log(data);
    
	    for (let o in data) {
	        console.log(data[o].amount); //후원 금액만 전부 꺼내기
        }
    });

<details>
<summary>callback</summary>

 - Return
	 - 0
	 	 - amount //후원 금액
		 - author
			 - id
			 - name
			 - imageURL
			 - hasMod //관리 권한을 가졌는지 (false / true)
		 - message
		 - time
	 - 1
	 - 2
	 - 3
	 - ...

</details>

    chat.onDisconnect(() => { //채팅창 연결이 끊겼을 때
		//TODO
    });

>

    await chat.send("ㅋㅋㅋㅋㅋㅋ"); //채팅 보내기 (login 후에만 가능)

>

    let userInfo = await chat.getUserInfo("유저의 channelID 값");

<details>
<summary>return</summary>

 - Return
	 - channelID
	 - name
	 - imageURL
	 - role //ex. streamer
	 - followDate //팔로우 날짜 ex. 2024-02-19 23:28:11

</details>

    await chat.disconnect(); //채팅창 연결 끊기

---

###  video

    const videoList = await buzzk.video.getList("channelID 값", 24); //channelID 값, 가져올 갯수
    console.log(videoList);

<details>
<summary>return</summary>

 - Return
	 - 0
	 	 - no
		 - id
		 - title
		 - category
		 - duration
		 - uploadOn
		 - imageURL
		 - trailerURL
	 - 1
	 - 2
	 - 3
	 - ...

</details>

    const video = await buzzk.video.get("no 값"); //videoList 에서 return 된 no 값
    console.log(video);
	console.log(video.videoURL[720]);

<details>
<summary>return</summary>

 - Return
	 - id
	 - title
	 - category
	 - duration
	 - uploadOn
	 - startOn
	 - imageURL
	 - trailerURL
	 - videoURL
	 	 - 144
		 - 720
		 - 1080

</details>