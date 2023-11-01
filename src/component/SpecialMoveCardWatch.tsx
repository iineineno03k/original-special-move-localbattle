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
            <Card sx={{ mb: 2, position: 'relative' }}>
                <Box display="flex" flexDirection="row" alignItems="center">
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
                    <CardContent >
                        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                            {data.furigana}
                        </Typography>
                        <Typography variant="h5" component="div">
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