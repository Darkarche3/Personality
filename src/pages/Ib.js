import React, { useRef } from 'react';
import '../styles/Marketplace.css';

export const Ib = () => {
    const selectRef = useRef(null);

    const handleButtonClick = () => {
        const selectedValue = selectRef.current.value;
        if (selectedValue) {
            window.location.href = selectedValue;
        }
    };

    return (
        <div>
            <div className="container md\:px-6">
                <section className="sect">
                    <h2 className="article">
                        International Business Management
                    </h2>
                    <div>
                        <select ref={selectRef}>
                            <option value="/student">Student</option>
                            <option value="/nus">NUS</option>
                            <option value="/ib">International Business</option>
                        </select>
                        <button className='button' onClick={handleButtonClick}>Go</button>
                    </div>

                    <div className="outermost">
                        <div className="outer">
                            <div
                                className="imgblock">
                                <div className="block">
                                    <div
                                        className="image">
                                        <img src="https://images.template.net/wp-content/uploads/2017/03/17114828/International-Business-Management-Sample-Resume.jpg" className="b" alt="" />
                                        <a href="#!">
                                            <div
                                                className="c">
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="d">
                                    <h5 className="e">International Business Management Resume Sample</h5>
                                    <p className="f">
                                        <small>Added <u>13.01.2022</u></small>
                                    </p>
                                    <p className="g">
                                        For careers in international Business
                                    </p>
                                    <a href="https://www.template.net/business/resume/simple-business-resume/" data-te-ripple-init data-te-ripple-color="light"
                                        className="h">Read
                                        more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
