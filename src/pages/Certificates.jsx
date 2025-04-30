import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CertificateGrid from '../components/CertificateGrid';
import CertificatePreview from '../components/CertificatePreview';

const Certificates = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userName = JSON.parse(localStorage.getItem('userName'));
                const data = { userName };
                console.log("Data: ", data);

                // Fetch courses
                await axios.post("/api/getCertificates", data).then((response) => {
                    let { certificates } = response.data.data;
                    setCertificates(certificates);
                    console.log("Response: ", response);
                });

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        console.log(certificates);
    }, []);


    return (
        <div className="p-6 max-w-[98vw] ml-16">
            {selectedCertificate ? <CertificatePreview setSelectedCertificate={setSelectedCertificate} selectedCertificate={selectedCertificate} /> :
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">My Certificates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((certificate) => {
                            return (
                                <CertificateGrid courseName={certificate.courseName} instructorName={certificate.instructorName} completionDate={certificate.completionDate} setSelectedCertificate={setSelectedCertificate} certificate={certificate} />
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}

export default Certificates