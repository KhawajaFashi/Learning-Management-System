import React from 'react'

const CertificatePreview = ({ setSelectedCertificate, selectedCertificate }) => {
    return (
        <div>
            <style>
                {`
                    @keyframes seal-rotate {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    .spin-animation {
                        animation: seal-rotate 20s linear infinite;
                    }
                `}
            </style>
            <button
                onClick={() => setSelectedCertificate(null)}
                className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Gallery
            </button>
            <div className='p-6'>
                <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border-8 border-double border-gray-200 p-8 print:border-0 print:shadow-none'>
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 spin-animation">
                            <svg className="w-full h-full text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Certificate of Completion</h1>
                        <p className="text-xl text-gray-600 font-medium">This is to certify that</p>
                    </div>

                    <div className="text-center space-y-6 my-12">
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">{selectedCertificate.issuedTo}</h2>
                        <p className="text-lg text-gray-600 mt-2">has successfully completed</p>
                        <h3 className="text-2xl text-gray-700 font-medium">{selectedCertificate.courseName}</h3>
                        <p className="text-lg text-gray-600 mt-2">under the guidance of</p>
                        <p className="text-xl font-medium text-gray-800">{selectedCertificate.instructorName}</p>
                        <p className="text-lg text-gray-600">
                            Completed on {new Date(selectedCertificate.completionDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="mt-16 flex justify-between items-center">
                        <div className="border-t-2 border-gray-300 pt-2 text-center w-48">
                            <p className="text-sm font-medium text-gray-800">{selectedCertificate.instructorName}</p>
                            <p className="text-xs text-gray-600">Instructor</p>
                        </div>

                        <div className="border-t-2 border-gray-300 pt-2 text-center w-48">
                            <p className="text-sm font-medium text-gray-800">VocalMaster</p>
                            <p className="text-xs text-gray-600">Platform Director</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                    </button>

                    <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share Certificate
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CertificatePreview