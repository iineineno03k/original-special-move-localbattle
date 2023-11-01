import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import { TailSpin } from "react-loader-spinner";
import { RoomDto } from '../types';

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

const HomePage: React.FC<MainPageProps> = ({ handleShare,
    handleJoinBattle,
    handleJudge,
    loading,
    isErrorDialogOpen,
    errorDialogMessage,
    isNotFoundDialogOpen,
    closeErrorDialog,
    closeNotFoundDialog,
    roomData,
    myName }) => {

    const checked = roomData && ["auserName", "buserName", "judgeUserName"].some((key) => {
        const name = roomData[key];
        return name === myName;
    });

    return (
        loading ? (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
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
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2 }}>
                <Button
                    variant="outlined"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.09)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' } }}
                    onClick={handleShare}>
                    友達を誘う
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleJoinBattle}
                    disabled={checked}>
                    バトルに参加する
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleJudge}
                    disabled={checked}>
                    ジャッジを行う
                </Button>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" textAlign={"center"} gutterBottom>
                            {roomData.auserName || '募集中'} VS {roomData.buserName || '募集中'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" textAlign={"center"}>
                            ジャッジ：{roomData.judgeUserName || '募集中'}
                        </Typography>
                    </Grid>
                </Grid>

                <Dialog
                    open={isErrorDialogOpen}
                    onClose={closeErrorDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">エラー</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {errorDialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeErrorDialog} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={isNotFoundDialogOpen}
                    onClose={closeNotFoundDialog}
                    aria-labelledby="not-found-dialog-title"
                >
                    <DialogTitle id="not-found-dialog-title">エラー</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Roomが見つかりませんでした。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeNotFoundDialog} color="primary" autoFocus>
                            アプリを閉じる
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        )
    );
}

export default HomePage;
