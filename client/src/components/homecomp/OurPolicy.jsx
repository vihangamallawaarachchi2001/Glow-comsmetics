import React from 'react';
import refundicon from '../../assets/icons/refundicon.png';
import qualityicon from '../../assets/icons/qualityicon.png';
import supporticon2 from '../../assets/icons/supporticon2.png';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        
        {/* Exchange Policy */}
        <div>
            <img src={refundicon} className='w-12 m-auto mb-5' alt='Easy Exchange Policy' />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p>We offer hassle-free exchange policy.</p>
        </div>

        {/* Quality Policy */}
        <div>
            <img src={qualityicon} className='w-12 m-auto mb-5' alt='7 Day Return Policy' />
            <p className='font-semibold'>7 Day Return Policy</p>
            <p>We provide 7 days free return policy.</p>
        </div>

        {/* Support Policy */}
        <div>
            <img src={supporticon2} className='w-12 m-auto mb-5' alt='Customer Support Policy' />
            <p className='font-semibold'>Customer Support Policy</p>
            <p>We are available 24/7 to assist you.</p>
        </div>
    </div>
  );
};

export default OurPolicy;
