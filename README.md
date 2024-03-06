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

 - JSON을 Parse 하는 중 오류가 생기는 문제 해결

> 

 - User-Agent 추가 (API 호출에 실패하는 문제 해결)

> 

 - chat 의 메세지를 핸들링하던 중 의도치 않게 오류가 나는 문제 해결

> 

 - WebSocket is not open 문제 해결

>

 - chat.getUserInfo 함수 추가

>

 - 방송 시작 시 onMessage 함수가 작동하지 않는 문제 수정

>

 - live.getDetail 함수의 Return 값에 category 항목 추가

##  ✒️ 마이그레이션 가이드 (v.1.2.x -> v.1.3.0)

<details>
<summary>펼쳐보기</summary>

	buzzk.channel

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | buzzk.channel.getChannel |
|--|--|
|  | buzzk.channel.search |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | buzzk.channel.followChannel |
|--|--|
|  | buzzk.channel.follow |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | buzzk.channel.unFollowChannel |
|--|--|
|  | buzzk.channel.unFollow |

---

	buzzk.live

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | buzzk.live.getLiveDetail |
|--|--|
|  | buzzk.live.getDetail |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | buzzk.live.getLiveStatus |
|--|--|
|  | buzzk.live.getStatus |

---

	buzzk.live.getDetail (getLiveDetail)

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | (return).channel.channelName |
|--|--|
|  | (return).channel.name |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_change-min.png?raw=true"  alt="BUZZK"  width="70"> | (return).channel.channelImageUrl |
|--|--|
|  | (return).channel.imageURL |

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | (return).channel.channelId |
|--|--|

---

| <img src="https://github.com/Emin-G/Img/blob/main/tags/tag_delete-min.png?raw=true"  alt="BUZZK"  width="70"> | (return).channel.verifiedMark |
|--|--|

</details>

##  👋 설치

1. `npm install buzzk`
2. `const buzzk = require("buzzk");`

##  🔥 빠른. 시작.

    const buzzk = require("buzzk");
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

###  login

    buzzk.login("NID_AUT 쿠키 값", "NID_SES 쿠키 값");

dotenv와 함께 사용하는 것을 매우 권장합니다.

    buzzk.login(process.env.NID_AUT, process.env.NID_SES);

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

    let channel = await buzzk.channel.get("channelID 값");
    console.log(channel);

<details>
<summary>return</summary>

 - Return
	 - channelID
	 - name
	 - description
	 - follower
	 - imageURL
	 - isLive

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
