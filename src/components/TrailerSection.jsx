import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';

const TrailerSection = () => {
    const [currentTrailer, setcurrentTrailer] = useState(dummyTrailers[0]);
    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>
            <div className='relative mt-6'>
                <BlurCircle top='-100px' right='-100px' />
                <ReactPlayer url={currentTrailer.videoUrl} controls={false} className='mx-auto max-w-full' width="960px" height="540px" />
            </div>
            <div className='flex flex-row items-center gap-3 w-300 px-10 mt-3'>
                <img src={dummyTrailers[1].image} className='w-[20%] hover:cursor-pointer' onClick={()=>{setcurrentTrailer(dummyTrailers[1])}}/>
                <img src={dummyTrailers[2].image} className='w-[20%] hover:cursor-pointer' onClick={()=>{setcurrentTrailer(dummyTrailers[2])}}/>
                <img src={dummyTrailers[3].image} className='w-[20%] hover:cursor-pointer' onClick={()=>{setcurrentTrailer(dummyTrailers[3])}}/>
                <img src={dummyTrailers[3].image} className='w-[20%] hover:cursor-pointer' onClick={()=>{setcurrentTrailer(dummyTrailers[3])}}/>

            </div>
        </div>

    )
}

export default TrailerSection