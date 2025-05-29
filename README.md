<img src="https://github.com/Emin-G/Img/blob/main/buzzk/buzzk_pamplet.gif?raw=true" alt="BuzzkThumb" width="100%">

#  뿌지직

<p align="center">
<img src="https://github.com/Emin-G/Img/blob/main/buzzk/buzzk_favi-min.png?raw=true" alt="BUZZK" width="30%">
</p>

<p align="center">
뿌지직은 치지직 챗봇을 더욱 쉽게 개발할 수 있도록 돕는 비공식 라이브러리 입니다.
</p>

---

##  📖 업데이트 내역

 ### 🎉 2.2 업데이트
 - 이제 Axios를 사용하여 API를 불러옵니다!
 - 더욱 안정적이고 빠른 성능을 보일 것으로 기대됩니다!

 ### 🎉 2.1 업데이트
 - 공식 API로 거의 대부분의 작업을 대체했어요!

> [!CAUTION]
> 이 버전 이후부터는 공식 API와 비공식 API를 혼용하여 사용합니다.
> 공식 API로 대체 가능한 기능은 모두 공식 API를 이용할 예정입니다.

> [!WARNING]
> * 비공식 API 전용 모듈은 더 이상 지원되지 않습니다.
> * 비공식 API로만 이루어진 모듈을 사용하시려면
> `npm install buzzk@1.11.3`

---

##  ✒️ 마이그레이션 가이드 (v.2.0.x -> v.2.1.0)

<details>
<summary>펼쳐보기</summary>

	buzzkChat

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | new buzzkChat("channelID 값") |
|--|--|
|  | new buzzkChat("accessToken 값") |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | 삭제 |
|--|--|
|  | (chat).getRecentChat() |

---

	buzzkChat.onMessage

> 채팅 여러개를 한 번에 받던 구조 (data[o].message) (for 문으로 data[o] 돌리던 구조)에서
> 채팅 하나 씩 받는 구조로 변경 (data.message)

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | 삭제 |
|--|--|
|  | (callback).author.imageURL |

---

	buzzkChat.onDonation

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | 삭제 |
|--|--|
|  | (callback).author.imageURL |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | 삭제 |
|--|--|
|  | (callback).time |

---

	buzzk.live

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | 삭제 |
|--|--|
|  | buzzk.live.getAccess() |

</details>

---

##  ✒️ 마이그레이션 가이드 (v.1.x -> v.2.0.0)

<details>
<summary>펼쳐보기</summary>

	buzzk.auth

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | 추가 |
|--|--|
|  | buzzk.auth |

---

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

    //buzzk.login("NID_AUT 쿠키 값", "NID_SES 쿠키 값");
	//buzzk.channel.follow, unfollow 시에만 사용.
    
    const buzzkChat = buzzk.chat;
    
    async function test () {
    
		let oauth = buzzk.oauth.get("code 값");
    
        let chat = new buzzkChat(oauth.access);
        await chat.connect(); //채팅창 연결
    
        chat.onMessage(async (data) => { //채팅이 왔을 때
			console.log(data.message);

			if (data.message == "!ping") await chat.send("pong!");
			//채팅 보내기

			if (data.message == "!공지") await chat.setNotice("테스트!");
			//채팅 상단 고정 (공지)

			let userInfo = await chat.getUserInfo(data.author.id);
			console.log(userInfo);
			//채팅 보낸 유저의 정보
        });

		chat.onDonation(async (data) => { //후원이 왔을 때
			//TODO
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

* 해당 함수는 이제 buzzk.channel.follow, unfollow 시에만 사용됩니다.
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

    let oauth = await buzzk.oauth.refresh("refreshToken 값");
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

✅ Official API

    const buzzkChat = buzzk.chat;
    let chat = new buzzkChat("accessToken 값");
    await chat.connect(); //채팅창 연결

>

✅ Official API

    chat.onMessage((data) => { //채팅이 왔을 때
    	console.log(data);
    });

<details>
<summary>callback</summary>

 - Return
		 - author
			 - id
			 - name
			 - hasMod //관리 권한을 가졌는지 (false / true)
		 - message
		 - emoji (Object - Key: 이모지 이름, Value: 이미지 URL)
		 - time

</details>

>

✅ Official API

    chat.onDonation((data) => { //도네이션이 왔을 때
    	console.log(data);
    });

<details>
<summary>callback</summary>

 - Return
	- type //CHAT or VIDEO
	- amount //후원 금액
	- author
		- id
		- name
		- hasMod //관리 권한을 가졌는지 (false / true)
	- message
	- emoji (Object - Key: 이모지 이름, Value: 이미지 URL)

</details>

>

✅ Official API

    chat.onDisconnect(() => { //채팅창 연결이 끊겼을 때
		//TODO
    });

>

✅ Official API

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