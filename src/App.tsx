import { useEffect, useState } from "react";
import liff from "@line/liff";
import { RoomDto, SpecialMoveDeckDto } from "./types";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./page/HomePage";
import JudgePage from "./page/JudgePage";
import WatchPage from "./page/WatchPage";

function App() {
  const [roomData, setRoomData] = useState<RoomDto>(null);
  const [role, setRole] = useState<"judger" | "battlerA" | "battlerB" | null>(null);
  const [idToken, setIdToken] = useState('');
  const [myName, setMyName] = useState('');
  const [deckData, setDeckData] = useState<SpecialMoveDeckDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');
  const [isNotFoundDialogOpen, setNotFoundDialogOpen] = useState(false);
  const [view, setView] = useState<"main" | "judge" | "watch">("main");
  const [specialMoveDecks, setSpecialMoveDecks] = useState({});
  const [judgeResult, setJudgeResult] = useState<"A" | "B">(null);
  const [resultEventCounter, setResultEventCounter] = useState(0);

  // roomCodeをURLパラメータから取得
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get("roomCode");

  const eventUrl = 'https://original-specialmove.onrender.com/rooms/stream/' + roomCode
  const roomApiUrl = 'https://original-specialmove.onrender.com/rooms/' + roomCode
  const battlerApiUrl = 'https://original-specialmove.onrender.com/rooms/battler'
  const judgerApiUrl = 'https://original-specialmove.onrender.com/rooms/judger'
  const deckApiUrl = 'https://original-specialmove.onrender.com/get-specialmove-deck';
  const getDeckUrl = 'https://original-specialmove.onrender.com/get-deck-localbattle/' + roomCode

  const handleShare = () => {
    const url = "https://liff.line.me/2001116233-Xw8xde2q?roomCode=" + roomCode
    liff.shareTargetPicker(
      [
        {
          type: "text",
          text: "一緒に必殺技対戦をしよう！\n対戦ルームはこちらです\n" + url
        }
      ],
      {
        isMultiple: true
      });
  };

  const handleJoinBattle = async () => {
    console.log(roomData)
    if (role !== null) {
      setErrorDialogMessage('既に参加者として登録しています');
      setErrorDialogOpen(true);
      return;
    }

    if (deckData.length === 0) {
      setErrorDialogMessage('デッキ登録をしていないためバトルに参加できません。');
      setErrorDialogOpen(true);
      return;
    }

    if (roomData.auserName === null) {
      setRole('battlerA');
    } else if (roomData.buserName === null) {
      setRole('battlerB');
    } else {
      setErrorDialogMessage('既に対戦者がいっぱいです。（2人まで）');
      setErrorDialogOpen(true);
      return;
    }
    const response = await fetch(battlerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roomCode, idToken })
    });
  };

  const handleJudge = async () => {
    if (role !== null) {
      setErrorDialogMessage('既に参加者として登録しています');
      setErrorDialogOpen(true);
      return;
    }

    if (roomData.judgeUserName === null) {
      setRole('judger');
    } else {
      setErrorDialogMessage('既に判定者がいっぱいです。（1人まで）')
      setErrorDialogOpen(true);
      return;
    }
    const response = await fetch(judgerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roomCode, idToken })
    });
  };

  useEffect(() => {
    // liff関連のlocalStorageのキーのリストを取得
    const getLiffLocalStorageKeys = (prefix: string) => {
      const keys = []
      for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.indexOf(prefix) === 0) {
          keys.push(key)
        }
      }
      return keys
    }
    // 期限切れのIDTokenをクリアする
    const clearExpiredIdToken = (liffId: any) => {
      const keyPrefix = `LIFF_STORE:${liffId}:`
      const key = keyPrefix + 'decodedIDToken'
      const decodedIDTokenString = localStorage.getItem(key)
      if (!decodedIDTokenString) {
        return
      }
      const decodedIDToken = JSON.parse(decodedIDTokenString)
      // 有効期限をチェック
      if (new Date().getTime() > decodedIDToken.exp * 1000) {
        const keys = getLiffLocalStorageKeys(keyPrefix)
        keys.forEach(function (key) {
          localStorage.removeItem(key)
        })
      }
    }
    const initializeLiff = async (id: string) => {
      clearExpiredIdToken(id);
      await liff.init({ liffId: id });

      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const token = liff.getIDToken();
      setIdToken(token);
      const name = liff.getProfile().then(profile => {
        setMyName(profile.displayName);
      })


      const formData = new FormData();
      formData.append('idToken', token);
      try {
        const deckResponse = await fetch(deckApiUrl, { method: 'POST', body: formData });
        const deckData = await deckResponse.json();
        setDeckData(deckData);
        setLoading(false);
      } catch (error) {
        console.error('デッキ取得エラー:', error);
        setLoading(false);
      }
    };
    initializeLiff('2001116233-Xw8xde2q');
  }, [])

  // SSE接続の開設
  useEffect(() => {
    const eventSource = new EventSource(eventUrl);

    eventSource.addEventListener("roomChange", (event) => {
      const data = JSON.parse(event.data);
      setRoomData(data);
    })

    // ジャッジ結果のイベント
    eventSource.addEventListener("judgeResult", (event) => {
      const result = event.data;
      if (result === "A" || result === "B") {
        setJudgeResult(result);
        setResultEventCounter(c => c + 1);
      }
    });


    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    // 初期のRoomデータをAPIから取得
    const fetchInitialRoomData = async () => {
      const response = await fetch(roomApiUrl);
      if (response.status === 404) {
        console.error('Room not found.');
        setLoading(false);
        setNotFoundDialogOpen(true);
        return;
      }
      const data = await response.json();
      setRoomData(data);
    };

    fetchInitialRoomData();
    // クリーンアップ関数
    return () => {
      eventSource.close();
    };
  }, [roomCode]);

  useEffect(() => {
    if (roomData && roomData.auserName && roomData.buserName && roomData.judgeUserName) {
      setLoading(true);

      (async () => {
        const response = await fetch(getDeckUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSpecialMoveDecks(data);
      });

      if (role === 'judger') {
        setView('judge');
      } else if (role === 'battlerA' || role === 'battlerB') {
        setView('watch');
      }
      setLoading(false);
    }
  }, [roomData]);

  useEffect(() => {

  }, [judgeResult]);

  const renderPage = () => {
    switch (view) {
      case "judge":
        return <JudgePage idToken={idToken} roomData={roomData} specialMoveDecks={specialMoveDecks} />;
      case "watch":
        return <WatchPage roomData={roomData} role={role} specialMoveDecks={specialMoveDecks} result={judgeResult} resultEventCounter={resultEventCounter} />;
      case "main":
      default:
        return (
          <HomePage
            handleShare={handleShare}
            handleJoinBattle={handleJoinBattle}
            handleJudge={handleJudge}
            loading={loading}
            isErrorDialogOpen={isErrorDialogOpen}
            errorDialogMessage={errorDialogMessage}
            isNotFoundDialogOpen={isNotFoundDialogOpen}
            closeErrorDialog={() => setErrorDialogOpen(false)}
            closeNotFoundDialog={() => {
              setNotFoundDialogOpen(false);
              liff.closeWindow();
            }}
            roomData={roomData}
            myName={myName}
          />
        );
    }
  };

  return (
    <Router>
      <div>
        {renderPage()}
      </div>
    </Router>
  );
}

export default App;
