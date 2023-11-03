import React, { useEffect, useState } from 'react'
import { RoomDto, SpecialMoveDeckDto, SpecialMoveDecks, SpecialMoveDto } from '../types';
import { TailSpin } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import SpecialMoveCard from '../component/SpecialMoveCard';
import SpecialMoveCardReversed from '../component/SpecialMoveCardReversed';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import liff from '@line/liff';

interface Props {
    idToken: string
    roomData: RoomDto
    specialMoveDecks: SpecialMoveDecks
}

const JudgePage: React.FC<Props> = ({ idToken, roomData, specialMoveDecks }) => {
    const [myGallary, setMyGallary] = useState<SpecialMoveDto[]>([]);
    const [deckA, setDeckA] = useState(specialMoveDecks[roomData.auserName]);
    const [deckB, setDeckB] = useState(specialMoveDecks[roomData.buserName]);
    const [loading, setLoading] = useState(true);
    const [fadeCard, setFadeCard] = useState(false);
    const [fadeReversedCard, setFadeReversedCard] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [winner, setWinner] = useState<string>('');

    const gallaryApiUrl = 'https://original-specialmove.onrender.com/get-specialmove';
    const judgeApiUrl = 'https://original-specialmove.onrender.com/judge/' + roomData.roomCode

    const handleWinFromCard = async () => {
        setFadeReversedCard(true);

        if (deckB[0]) {

            const url = judgeApiUrl + '?result=A';
            await fetch(url);

            setTimeout(() => {
                const newData = [...deckB];
                newData.splice(0, 1);
                setDeckB(newData);
                setFadeReversedCard(false);
            }, 350);
        }
    };

    const handleWinFromReversedCard = async () => {
        setFadeCard(true);

        if (deckA[0]) {
            const url = judgeApiUrl + '?result=B';
            await fetch(url);

            setTimeout(() => {
                const newData = [...deckA];
                newData.splice(0, 1);
                setDeckA(newData);
                setFadeCard(false);
            }, 350);
        }
    };

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
        const formData = new FormData();
        formData.append('idToken', idToken);

        (async () => {
            try {
                const response = await fetch(gallaryApiUrl, { method: 'POST', body: formData });
                const data = await response.json();
                setMyGallary(data);
            } catch (error) {
                console.error('必殺技取得エラー:', error);
            } finally {
                console.log("あなたはjudgerです")
                setLoading(false);
            }
        })
    }, []);

    useEffect(() => {
        if (deckA.length == 0) {
            setWinner(roomData.buserName);
            setShowModal(true);
            return;
        }

        if (deckB.length == 0) {
            setWinner(roomData.auserName);
            setShowModal(true);
            return;
        }

    }, [deckA, deckB]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}>
                    <TailSpin
                        height={80}
                        width={80}
                        color="#4fa94d"
                        ariaLabel="tail-spin-loading"
                        radius={1}
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={loading}
                    />
                </div>
            ) : (
                <>
                    {deckA[0] && (
                        <motion.div initial="visible" animate={fadeCard ? "hidden" : "visible"} variants={fadeOut}>
                            <SpecialMoveCard key={deckA[0].id} myGallary={myGallary} data={deckA[0]} idToken={idToken} onWin={handleWinFromCard} />
                        </motion.div>
                    )}
                    <div style={{ fontSize: '24px', fontWeight: 'bold', backgroundColor: 'white', borderRadius: '50%', padding: '10px 20px', margin: '20px 0', textAlign: 'center' }}>VS</div>
                    {deckB[0] && (
                        <motion.div initial="visible" animate={fadeReversedCard ? "hidden" : "visible"} variants={fadeOut}>
                            <SpecialMoveCardReversed key={deckB[0].id} myGallary={myGallary} data={deckB[0]} idToken={idToken} onWin={handleWinFromReversedCard} />
                        </motion.div>
                    )}

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
                </>
            )}
        </div>
    )
}

export default JudgePage