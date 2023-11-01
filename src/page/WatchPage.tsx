import React, { useState, useEffect } from 'react'
import { RoomDto, SpecialMoveDeckDto, SpecialMoveDto } from '../types'
import liff from '@line/liff'
import { motion } from 'framer-motion'
import SpecialMoveCardWatch from '../component/SpecialMoveCardWatch'
import SpecialMoveCardReversedWatch from '../component/SpecialMoveCardReversedWatch'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';

interface Props {
  roomData: RoomDto
  role: string
  specialMoveDecks: Record<string, SpecialMoveDeckDto[]>
  result: string
  resultEventCounter: number;
}

const WatchPage: React.FC<Props> = ({ roomData, role, specialMoveDecks, result, resultEventCounter }) => {
  const [deckA, setDeckA] = useState([]);
  const [deckB, setDeckB] = useState([]);
  const [fadeCard, setFadeCard] = useState(false);
  const [fadeReversedCard, setFadeReversedCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState<string>('');

  const handleClose = () => {
    setShowModal(false);
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  };

  const fadeOut = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.2 }
  };

  useEffect(() => {
    //自分のデッキを手前側に配置する。
    if (role === "battlerA") {
      setDeckA(specialMoveDecks[roomData.buserName])
      setDeckB(specialMoveDecks[roomData.auserName]);
    } else if (role === "battlerB") {
      setDeckA(specialMoveDecks[roomData.auserName])
      setDeckB(specialMoveDecks[roomData.buserName]);
    }

  }, []);

  useEffect(() => {
    if (result === "A") {
      setFadeReversedCard(true);
      setTimeout(() => {
        const newData = [...deckB];
        newData.splice(0, 1);
        setDeckB(newData);
        setFadeReversedCard(false);
      }, 350);
    } else if (result === "B") {
      setFadeCard(true);
      setTimeout(() => {
        const newData = [...deckA];
        newData.splice(0, 1);
        setDeckA(newData);
        setFadeCard(false);
      }, 350);
    }

  }, [resultEventCounter]);

  useEffect(() => {
    if (deckA.length == 0) {
      //手前側の勝ち
      if (role === 'battlerA') {
        setWinner(roomData.auserName);
      } else if (role === "battlerB") {
        setWinner(roomData.buserName);
      }
      setShowModal(true);
      return;
    }
    if (deckB.length == 0) {
      //奥側の勝ち
      if (role === 'battlerA') {
        setWinner(roomData.buserName);
      } else if (role === "battlerB") {
        setWinner(roomData.auserName);
      }
      setShowModal(true);
      return;
    }

  }, [deckA, deckB]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      <motion.div initial="visible" animate={fadeCard ? "hidden" : "visible"} variants={fadeOut}>
        <SpecialMoveCardWatch key={deckA[0].id} data={deckA[0]} />
      </motion.div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', backgroundColor: 'white', borderRadius: '50%', padding: '10px 20px', margin: '20px 0', textAlign: 'center' }}>VS</div>
      <motion.div initial="visible" animate={fadeReversedCard ? "hidden" : "visible"} variants={fadeOut}>
        <SpecialMoveCardReversedWatch key={deckB[0].id} data={deckB[0]} />
      </motion.div>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
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
    </div >
  )
}

export default WatchPage