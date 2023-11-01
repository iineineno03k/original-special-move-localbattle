import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Button,
    Dialog,
    Box,
    CardContent,
    IconButton,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import { SpecialMoveDto } from '../types';

interface Props {
    myGallary: SpecialMoveDto[];
    data: SpecialMoveDto;
    idToken: string;
    onWin: () => void;
}

const SpecialMoveCardReversed: React.FC<Props> = ({ myGallary, data, idToken, onWin }) => {
    const [open, setOpen] = useState(false);
    const isAlreadyFavorited = myGallary.some(item => item.id === data.id);
    const [favorited, setFavorited] = useState(isAlreadyFavorited);

    const favoriteApiUrl = 'http://localhost:8080/regist-gallary';

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addFavoriteSp = async () => {
        try {
            const formData = new FormData();
            formData.append('spId', data.id.toString());
            formData.append('idToken', idToken);
            const response = await fetch(favoriteApiUrl, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setFavorited(true);
            } else {
                console.error("ギャラリー登録エラー");
            }
        } catch (error) {
            console.error("ギャラリー登録エラー", error);
        }
    }

    return (
        <Box flexDirection="column" alignItems="start">
            <Card sx={{ mb: 2, position: 'relative' }}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <IconButton
                        onClick={addFavoriteSp}
                        disabled={favorited}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        {favorited ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <CardContent>
                        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                            {data.furigana}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {data.spName}
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpen}>
                            詳細
                        </Button>
                        <Button variant="outlined" color='error' sx={{ mt: 2, ml: 2 }} onClick={() => { onWin(); }}>
                            WIN
                        </Button>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover'
                        }}
                        image={data.imageName}
                        alt={data.spName}
                    />
                </Box>
                <Typography textAlign={"center"} variant="h6" component="div" sx={{ ml: 2, mr: 2 }}>
                    {data.heading}
                </Typography>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
            >
                <IconButton
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ p: 2, overflowY: 'auto' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: '100%', objectFit: 'cover' }}
                        image={data.imageName}
                        alt={data.spName}
                    />
                    <Typography textAlign={"center"} variant="caption" display="block" sx={{ mt: 2 }}>
                        {data.furigana}
                    </Typography>
                    <Typography textAlign={"center"} variant="h5" component="div" sx={{ mt: 1 }}>
                        {data.spName}
                    </Typography>
                    <Typography textAlign={"center"} variant="h6" component="div" sx={{ mt: 2 }}>
                        {data.heading}
                    </Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }} sx={{ mt: 2 }}>
                        {data.description}
                    </Typography>
                </Box>
            </Dialog>
        </Box>
    );
};

export default SpecialMoveCardReversed;
