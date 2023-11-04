import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    CardContent,
} from '@mui/material';
import { SpecialMoveDto } from '../types';

interface Props {
    data: SpecialMoveDto;
}

const SpecialMoveCardWatch: React.FC<Props> = ({ data }) => {
    return (
        <Box flexDirection="column" alignItems="start">
            <Card
                sx={{
                    mb: 2,
                    width: '340px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    transition: '0.3s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box display="flex" flexDirection="row" alignItems="center">
                    <CardMedia
                        component="img"
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            mr: 1.5
                        }}
                        image={data.imageName}
                        alt={data.spName}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 1, minWidth: 0 }}>
                        <Typography gutterBottom variant="caption" display="block" textAlign="center" sx={{ mt: 2.5 }}>
                            {data.furigana}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
                            {data.spName}
                        </Typography>
                    </CardContent>
                </Box>
                <Typography textAlign={"center"} variant="h6" component="div" sx={{ ml: 2, mr: 2 }}>
                    {data.heading}
                </Typography>
            </Card>
        </Box>
    );
};


export default SpecialMoveCardWatch;