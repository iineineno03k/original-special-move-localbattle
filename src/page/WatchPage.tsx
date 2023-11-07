import React, { useState, useEffect } from 'react'
import { RoomDto, SpecialMoveDeckDto, SpecialMoveDecks } from '../types'
import liff from '@line/liff'
import { motion } from 'framer-motion'
import SpecialMoveCardWatch from '../component/SpecialMoveCardWatch'
import SpecialMoveCardReversedWatch from '../component/SpecialMoveCardReversedWatch'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import "../App.css";

interface Props {
  roomData: RoomDto
  role: string
  specialMoveDecks: SpecialMoveDecks
  result: string
  resultEventCounter: number;
}

const WatchPage: React.FC<Props> = ({ roomData, role, specialMoveDecks, result, resultEventCounter }) => {
  const [deckA, setDeckA] = useState<SpecialMoveDeckDto[] | undefined>();
  const [deckB, setDeckB] = useState<SpecialMoveDeckDto[] | undefined>();
  const [fadeCard, setFadeCard] = useState(false);
  const [fadeReversedCard, setFadeReversedCard] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [winner, setWinner] = useState<string>('');

  const handleClose = () => {
    setShowWinModal(false);
    setShowLoseModal(false);
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  };

  const fadeOut = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.2 }
  };

  useEffect(() => {
    console.log("バトルを開始します。")
    //自分のデッキを手前側に配置する。
    if (role === "battlerA") {
      setDeckA(specialMoveDecks[roomData.buserName])
      setDeckB(specialMoveDecks[roomData.auserName]);
      console.log("あなたはbattlerAです")
    } else if (role === "battlerB") {
      setDeckA(specialMoveDecks[roomData.auserName])
      setDeckB(specialMoveDecks[roomData.buserName]);
      console.log("あなたはbattlerBです")
    }

  }, []);

  useEffect(() => {
    if (result === "A") {
      if (role == "battlerA") {
        setFadeCard(true);
        setTimeout(() => {
          const newData = [...deckA];
          newData.splice(0, 1);
          setDeckA(newData);
          setFadeCard(false);
        }, 350);
      } else if (role === "battlerB") {
        setFadeReversedCard(true);
        setTimeout(() => {
          const newData = [...deckB];
          newData.splice(0, 1);
          setDeckB(newData);
          setFadeReversedCard(false);
        }, 350);
      }
    } else if (result === "B") {
      if (role === "battlerA") {
        setFadeReversedCard(true);
        setTimeout(() => {
          const newData = [...deckB];
          newData.splice(0, 1);
          setDeckB(newData);
          setFadeReversedCard(false);
        }, 350);
      } else if (role === "battlerB") {
        setFadeCard(true);
        setTimeout(() => {
          const newData = [...deckA];
          newData.splice(0, 1);
          setDeckA(newData);
          setFadeCard(false);
        }, 350);
      }

    }

  }, [resultEventCounter]);

  useEffect(() => {
    if (deckA && deckB) {

      if (deckA.length == 0) {
        //手前側の勝ち
        if (role === 'battlerA') {
          setWinner(roomData.auserName);
        } else if (role === "battlerB") {
          setWinner(roomData.buserName);
        }
        setShowWinModal(true);
        return;
      }
      if (deckB.length == 0) {
        //奥側の勝ち
        if (role === 'battlerA') {
          setWinner(roomData.buserName);
        } else if (role === "battlerB") {
          setWinner(roomData.auserName);
        }
        setShowLoseModal(true);
        return;
      }
    }

  }, [deckA, deckB]);

  const vsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // 中央に寄せる
    width: '100%', // コンテナを親の幅いっぱいに広げる
  };

  const vsTextStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#3A3A3C',
    textShadow: '2px 2px 4px #222224',
    margin: '0 20px', // テキストの左右のマージン
  };

  const barStyle: React.CSSProperties = {
    height: '4px',
    flex: 1, // バーを可能な限りの幅に拡張
    background: 'linear-gradient(to right, #000000, #555555, #000000)',
    boxShadow: '0px 0px 10px 3px rgba(255, 0, 0, 0.6)',
  };

  return (
    <div className="rootContainer">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
        {deckA?.length > 0 && (
          <motion.div initial="visible" animate={fadeCard ? "hidden" : "visible"} variants={fadeOut}>
            <Box textAlign={"left"} >
              <Typography style={{ color: 'white' }}>
                残: {deckA.length}枚
              </Typography>
            </Box>
            <SpecialMoveCardWatch key={deckA[0].id} data={deckA[0]} />
          </motion.div>
        )}
        <div style={vsContainerStyle}>
          <div style={barStyle}></div>
          <div style={vsTextStyle}>VS</div>
          <div style={barStyle}></div>
        </div>
        {deckB?.length > 0 && (
          <motion.div initial="visible" animate={fadeReversedCard ? "hidden" : "visible"} variants={fadeOut}>
            <SpecialMoveCardReversedWatch key={deckB[0].id} data={deckB[0]} />
            <Box textAlign={"right"}>
              <Typography style={{ color: 'white' }}>
                残: {deckB.length}枚
              </Typography>
            </Box>
          </motion.div>
        )}

        <Dialog open={showWinModal} onClose={() => setShowWinModal(false)}>
          <DialogTitle>🎉 おめでとうございます！ 🎉</DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center" gutterBottom>
              勝者は <span style={{ color: 'gold' }}>{winner}</span> さんです！
              <StarIcon color="primary" fontSize="large" style={{ margin: '0 10px' }} />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showLoseModal} onClose={() => setShowLoseModal(false)}>
          <DialogTitle>残念・・・</DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center" gutterBottom>
              勝者は <span style={{ color: 'gold' }}>{winner}</span> さんです・・・
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    </div>
  )
}

export default WatchPage