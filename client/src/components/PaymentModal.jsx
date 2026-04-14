import React, { useState } from 'react';
import { CreditCard, X, CheckCircle, LoaderCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount, onSuccessfulPayment }) => {
    const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvc: '' });
    const [status, setStatus] = useState('idle'); // idle, processing, success, error

    if (!isOpen) return null;

    const handlePayment = (e) => {
        e.preventDefault();
        
        // basic validation
        if(cardDetails.number.length < 16 || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc) {
            return setStatus('error');
        }

        setStatus('processing');
        
        // Simulate network / processing delay
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onSuccessfulPayment();
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1c29] border border-gray-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {status !== 'success' && status !== 'processing' && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                )}
                
                <div className="p-8">
                    {status === 'idle' || status === 'error' ? (
                        <>
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <CreditCard className="text-primary w-6 h-6" /> Payment Details
                            </h2>
                            <p className="text-gray-400 mb-6 border-b border-gray-700 pb-4">
                                Total Amount: <span className="text-white font-bold text-lg">₹{amount}</span>
                            </p>
                            
                            {status === 'error' && (
                                <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm border border-red-500/20">
                                    Please fill in all card details correctly.
                                </div>
                            )}

                            <form onSubmit={handlePayment} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Cardholder Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        required
                                        value={cardDetails.name}
                                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Card Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="0000 0000 0000 0000" 
                                        maxLength="16"
                                        required
                                        value={cardDetails.number}
                                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition tracking-widest"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-400 mb-1 block">Expiry</label>
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY" 
                                            maxLength="5"
                                            required
                                            value={cardDetails.expiry}
                                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                            className="w-full bg-black/40 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-400 mb-1 block">CVC</label>
                                        <input 
                                            type="password" 
                                            placeholder="***" 
                                            maxLength="3"
                                            required
                                            value={cardDetails.cvc}
                                            onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                                            className="w-full bg-black/40 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition tracking-widest"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full mt-4 bg-primary text-white py-4 rounded-lg font-bold hover:bg-primary/90 transition cursor-pointer shadow-lg shadow-primary/20"
                                >
                                    Pay ₹{amount}
                                </button>
                            </form>
                        </>
                    ) : status === 'processing' ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <LoaderCircle className="w-16 h-16 text-primary animate-spin mb-6" />
                            <h3 className="text-xl font-bold animate-pulse">Processing Payment...</h3>
                            <p className="text-gray-400 text-sm mt-2">Please do not close this window</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 mb-6">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h3>
                            <p className="text-gray-400 text-center">Your tickets are being booked...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
