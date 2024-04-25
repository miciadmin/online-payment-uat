import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import { endpoint, currencyFormat, isValidEmail, isValidMobileNo, lpad, goBack} from '../utils';

function Step1() {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    
    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [contactDetails, setContactDetails] = useState(JSON.parse(sessionStorage.getItem('contactDtls')));

    const [isSearchingPolicy, setIsSearchingPolicy] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorPolicy, setErrorPolicy] = useState(null);
    const [errorContact, setErrorContact] = useState(null);

    const inputRef = useRef(null);
    useEffect(() => {
        //inputRef.current.focus();
        if (policyDetails) {
            setIsSearchingPolicy(false);
        }
        if (contactDetails) {
            setContactFormData({
                email: contactDetails.email,
                mobileNo: contactDetails.mobileNo,
            })
        }
    }, [policyDetails]);

    const [policyFormData, setPolicyFormData] = useState({
        lineCd: '',
        sublineCd: '',
        issCd: '',
        issYy: '',
        seqNo: '',
        renewNo: ''
    });
    const handlePolicyFormDataChange = (e) => {
        const { name, value } = e.target;
        setPolicyFormData({
            ...policyFormData,
            [name]: value.toUpperCase()
        });
        setErrorPolicy(null);
    };

    const [contactFormData, setContactFormData] = useState({
        email: '',
        mobileNo: ''
    });
    const handleContactFormDataChange = (e) => {
        const { name, value } = e.target;
        setContactFormData({
            ...contactFormData,
            [name]: value
        });
        setErrorContact(null);
    };
    const searchAnotherPolicy = (e) => {
        setPolicyDetails(null);
        setContactDetails(null);
        setErrorPolicy(null);
        setIsSearchingPolicy(true);
        setPolicyFormData({
            lineCd: '',
            sublineCd: '',
            issCd: '',
            issYy: '',
            seqNo: '',
            renewNo: ''
        });
        setContactFormData({
            email: '',
            mobileNo: ''
        });
        inputRef.current.focus();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (policyFormData.lineCd
        && policyFormData.sublineCd
        && policyFormData.issCd
        && policyFormData.issYy
        && policyFormData.seqNo
        && policyFormData.renewNo) {
            proceedPolicySearch();
        } else {
            setErrorPolicy('(Fill empty fields first)');
        }
    };
    const proceedPolicySearch = async () =>  {
        try {
            setLoading(true);
            const response = await fetch(`${endpoint()}/inquire?lineCd=${policyFormData.lineCd}&sublineCd=${policyFormData.sublineCd}&issCd=${policyFormData.issCd}&issYy=${policyFormData.issYy}&seqNo=${policyFormData.seqNo}&renewNo=${policyFormData.renewNo}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if(data.length > 0) {
                setPolicyDetails(data[0])
                setIsSearchingPolicy(false);
            } else {
                setErrorPolicy('(Policy not found!)');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSeqNoFocusOut = (e) => {
        const paddedValue = lpad(e.target.value, 6);
        e.target.value = paddedValue
        setPolicyFormData({
            ...policyFormData,
            seqNo: paddedValue
        });
    };
    const handleRenewNoFocusOut = (e) => {
        const paddedValue = lpad(e.target.value, 2);
        e.target.value = paddedValue
        setPolicyFormData({
            ...policyFormData,
            renewNo: paddedValue
        });
    };
    const handleNumInputOnly = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').toUpperCase();
    };
    const handleTextInputOnly = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    };
    const goNextPage= (e) => {
        let validEmail = isValidEmail(contactFormData.email);
        let validMobile = isValidMobileNo(contactFormData.mobileNo);
        if(validEmail) {
            if(validMobile) {
                sessionStorage.setItem('contactDtls', JSON.stringify(contactFormData));
                sessionStorage.setItem('policyDtls', JSON.stringify(policyDetails));
                window.location.href = 'payment-step2';
            } else {
                setErrorContact('(Invalid mobile number)');
            }
        } else {
            setErrorContact('(Invalid email address)');
        }
    };

    return(
        <div className="main-container">
            
            <Sidebar isVisible={isSidebarVisible}  onClose={()=>setSidebarVisible(false)}/>

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2" onClick={goBack}>
                        <i className="bi bi-arrow-left-short ico-btn" />
                    </div>
                    <i className="bi bi-list ico-btn" onClick={()=>setSidebarVisible(!isSidebarVisible)}/>
                </div>
                <div className="steps">
                    <div className="step-line" />
                    <div className="step-items">
                        <button className="step-button done" type="button">1</button>
                        <div className="step-title">Search Policy</div>
                    </div>
                    <div className="step-items">
                        <button className="step-button" type="button">2</button>
                        <div className="step-title">Choose Method</div>
                    </div>
                        <div className="step-items">
                        <button className="step-button" type="button">3</button>
                        <div className="step-title">Review Payment</div>
                    </div>
                </div>

                <div className="note-box">
                    <p className="note-title">Please note the following guidelines for processing payments:</p>
                    <p>1. Policy Status: Payments can only be processed for policies that are not overdue.</p>
                    <p>2. Claim Status: Ensure that there are no outstanding claims on your policy before proceeding with the payment.</p>
                    <p>3. Payment Type: Only full payments for main policies are accepted. Endorsements are excluded from online payment processing.</p>
                </div>

            {isSearchingPolicy && (
                <div className="card">
                    <div className="space-between">
                        <span className="card-title mb-2">Enter your Policy No.:</span>
                        {errorPolicy && (
                            <span className="text-error" style={{display: 'block'}}>{errorPolicy}</span>
                        )}
                    </div>
                    <div className="policy-no-fields">
                        <input type="text" className="form-control text-center" name="lineCd" value={policyFormData.lineCd} onChange={handlePolicyFormDataChange} onInput={handleTextInputOnly} maxLength={2} required ref={inputRef}/>
                        <input type="text" className="form-control text-center" name="sublineCd" value={policyFormData.sublineCd} onChange={handlePolicyFormDataChange} onInput={handleTextInputOnly} maxLength={5} required/>
                        <input type="text" className="form-control text-center" name="issCd" value={policyFormData.issCd} onChange={handlePolicyFormDataChange} onInput={handleTextInputOnly} maxLength={2} required/>
                        <input type="text" className="form-control text-center" name="issYy" value={policyFormData.issYy} onChange={handlePolicyFormDataChange} onInput={handleNumInputOnly} maxLength={2} required/>
                        <input type="text" className="form-control text-center" name="seqNo" value={policyFormData.seqNo} onChange={handlePolicyFormDataChange} onInput={handleNumInputOnly} onBlur={handleSeqNoFocusOut} maxLength={6} required/>
                        <input type="text" className="form-control text-center" name="renewNo" value={policyFormData.renewNo} onChange={handlePolicyFormDataChange} onInput={handleNumInputOnly} onBlur={handleRenewNoFocusOut} maxLength={2} required/>
                    </div>
                    <span className="text-gray my-2">(Example: PA-SPA-HO-24-000123-00)</span>
                    <div className="text-center">
                        <button type="button" className="btn btn-success btn-w" onClick={handleSubmit}>
                            {loading ? <><i className="spinner-border spinner-border-sm"></i> Searching</> : <><i className="bi bi-search"></i> Search</>}
                        </button>
                    </div>
                </div>
            )}

            {policyDetails && (
                <div>
                    <div id="policy-dtls-container">
                        <div className="card">
                            <span className="card-title">Policy Details</span>
                            <div className="row">
                                <div className="space-between col-md-12 my-1">
                                    <span className="text-gray">Policy No.:</span>
                                    <span className="text-right" id="policy-no">
                                        {policyDetails.line_cd}-
                                        {policyDetails.subline_cd}-
                                        {policyDetails.iss_cd}-
                                        {policyDetails.issue_yy}-
                                        {lpad(policyDetails.pol_seq_no, 6)}-
                                        {lpad(policyDetails.renew_no, 2)}
                                    </span>
                                </div>
                                <div className="space-between col-md-12 my-1">
                                    <span className="text-gray">Invoice No.:</span>
                                    <span className="text-right" id="invoice-no">{policyDetails.invoice_no}</span>
                                </div>
                                <div className="space-between col-md-12 my-1">
                                    <span className="text-gray">Assured:</span>
                                    <span className="text-right" id="assured">{policyDetails.assd_name}</span>
                                </div>
                                <div className="space-between col-md-12 my-1">
                                    <span className="text-gray">Due Date:</span>
                                    <span className="text-right" id="due-date">{policyDetails.due_date}</span>
                                </div>
                                <div className="space-between col-md-12 my-2">
                                    <span className="text-gray">Total Amount Due:</span>
                                    <span className="text-right fw-bold" id="total-amount">Php {currencyFormat(policyDetails.total_amount_due)}</span>
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <button type="button" className="btn btn-outline-success btn-w" onClick={searchAnotherPolicy}> Search another policy</button>
                            </div>
                        </div>
                    </div>

                    
                    <div id="add-contact-container">
                        <div className="divider"></div>

                        <div className="card">
                            <span className="card-title">Add Contact Details</span>
                            <div className="row">
                                <div className="col-xl-6 my-2">
                                    <label htmlFor="inputPassword5" className="form-label text-gray">Email*</label>
                                    <input type="text" className="form-control" name="email" value={contactFormData.email} onChange={handleContactFormDataChange} />
                                </div>
                                <div className="col-xl-6 my-2">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Mobile No*</label>
                                    <input type="text" className="form-control" name="mobileNo" value={contactFormData.mobileNo} onChange={handleContactFormDataChange} />
                                </div>
                            </div>
                            {errorContact &&(
                                <span className="text-error" style={{display: 'block'}}>{errorContact}</span>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="row mt-4">
                            <div className="col-sm-6 mb-2"></div>
                            <div className="col-sm-6 text-right">
                                <button type="button" className="btn btn-success btn-w" onClick={goNextPage}>Next <i className="bi bi-chevron-right fs-12 ml-2"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                
            </div>
        </div>
    )
}

export default Step1