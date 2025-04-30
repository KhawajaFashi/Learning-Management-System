import React from 'react'

const CertificateGrid = (props) => {
    return (
        <div>
            <div
                className="relative bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => props.setSelectedCertificate(props.certificate)}
            >
                {console.log("hello: ", props.courseName)}
                <div className="absolute top-4 right-4 w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{props.courseName}</h3>
                <p className="text-sm text-gray-600 mb-4">{props.completionDate}</p>
                <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {props.instructorName}
                </div>
            </div>
        </div>
    )
}

export default CertificateGrid