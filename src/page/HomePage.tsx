import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography, ButtonGroup, Paper, useTheme } from '@mui/material';
import { TailSpin } from "react-loader-spinner";
import { RoomDto } from '../types';
import "./App.css";

interface MainPageProps {
    handleShare: () => void;
    handleJoinBattle: () => void;
    handleJudge: () => void;
    loading: boolean;
    isErrorDialogOpen: boolean;
    errorDialogMessage: string;
    isNotFoundDialogOpen: boolean;
    closeErrorDialog: () => void;
    closeNotFoundDialog: () => void;
    roomData: RoomDto
    myName: string
}

const HomePage = ({
    handleShare,
    handleJoinBattle,
    handleJudge,
    loading,
    isErrorDialogOpen,
    errorDialogMessage,
    isNotFoundDialogOpen,
    closeErrorDialog,
    closeNotFoundDialog,
    roomData,
    myName
}: MainPageProps) => {
    const checked = roomData && ["auserName", "buserName", "judgeUserName"].some((key) => roomData[key] === myName);
    const theme = useTheme();


    return (
        <Container maxWidth="sm" sx={{ pt: theme.spacing(10), pb: theme.spacing(10), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {loading && (
                <div className="overlay">
                    <TailSpin
                        height={80}
                        width={80}
                        color={theme.palette.primary.main}
                        ariaLabel="tail-spin-loading"
                        radius={1}
                        visible={true}
                    />
                </div>
            )}
            {!loading && (
                <Paper elevation={3} sx={{ p: theme.spacing(4), width: '100%', mb: theme.spacing(2), textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        対戦ルーム
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: theme.spacing(2) }}>
                        {roomData.auserName || '募集中'} VS {roomData.buserName || '募集中'}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: theme.spacing(3) }}>
                        ジャッジ：{roomData.judgeUserName || '募集中'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleJoinBattle}
                        disabled={checked}
                        sx={{ mb: theme.spacing(1) }}
                    >
                        バトルに参加する
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleJudge}
                        disabled={checked}
                    >
                        ジャッジを行う
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ mt: theme.spacing(2) }}
                        onClick={handleShare}
                    >
                        友達を誘う
                    </Button>
                </Paper>
            )}
            <Dialog open={isErrorDialogOpen} onClose={closeErrorDialog}>
                <DialogTitle>エラー</DialogTitle>
                <DialogContent>
                    <DialogContentText>{errorDialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeErrorDialog} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isNotFoundDialogOpen} onClose={closeNotFoundDialog}>
                <DialogTitle>エラー</DialogTitle>
                <DialogContent>
                    <DialogContentText>Roomが見つかりませんでした。</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNotFoundDialog} color="primary">アプリを閉じる</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default HomePage;
