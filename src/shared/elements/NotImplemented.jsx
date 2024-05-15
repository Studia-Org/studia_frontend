import React from 'react';

export const NotImplemented = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center mt-44'>
      <h1 className='text-4xl font-bold text-black'>🚀 This feature is not implemented yet!</h1>
      <p className='w-3/4 my-6 font-medium'>
        We apologize for the inconvenience. We are diligently working on developing this feature to enhance your experience significantly. Please stay tuned for the upcoming release.
      </p>
      <img className='mt-5' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="Feature Coming Soon" />
    </div>
  );
};
