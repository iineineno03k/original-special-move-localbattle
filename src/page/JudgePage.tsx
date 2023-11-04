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
    myGallary: SpecialMoveDto[]
}

const JudgePage: React.FC<Props> = ({ idToken, roomData, specialMoveDecks, myGallary }) => {
    const [deckA, setDeckA] = useState<SpecialMoveDeckDto[] | undefined>();
    const [deckB, setDeckB] = useState<SpecialMoveDeckDto[] | undefined>();
    const [loading, setLoading] = useState(true);
    const [fadeCard, setFadeCard] = useState(false);
    const [fadeReversedCard, setFadeReversedCard] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [winner, setWinner] = useState<string>('');

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
        console.log("あなたはjudgerです")
        setDeckA(specialMoveDecks[roomData.auserName]);
        setDeckB(specialMoveDecks[roomData.buserName]);
        console.log("デッキAの内容は" + deckA);
        console.log("デッキBの内容は" + deckB);

        setLoading(false);
    }, []);

    useEffect(() => {
        if (deckA && deckB) {
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
                    {deckA.length > 0 && (
                        <motion.div initial="visible" animate={fadeCard ? "hidden" : "visible"} variants={fadeOut}>
                            <SpecialMoveCard key={deckA[0].id} myGallary={myGallary} data={deckA[0]} idToken={idToken} onWin={handleWinFromCard} />
                        </motion.div>
                    )}
                    <div style={vsContainerStyle}>
                        <div style={barStyle}></div>
                        <div style={vsTextStyle}>VS</div>
                        <div style={barStyle}></div>
                    </div>
                    {deckB.length > 0 && (
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