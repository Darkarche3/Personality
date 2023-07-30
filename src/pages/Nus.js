import React, { useRef } from 'react'
import '../styles/Marketplace.css';


const Nus = () => {
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
                        NUS
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
                                        <img src="https://nus.edu.sg/CFG/images/default-source/student/career-resources/ugresumelabelc8f7145994bb46b6837b13048424cdd3.png?sfvrsn=cad4b422_4" className="b" alt="" />
                                        <a href="#!">
                                            <div
                                                className="c">
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="d">
                                    <h5 className="e">NUS Resume</h5>
                                    <p className="f">
                                        <small>Published <u>13.01.2022</u></small>
                                    </p>
                                    <p className="g">
                                        NUS resume for students
                                    </p>
                                    <a href="https://nus.edu.sg/cfg/students/career-resources/create-an-impressive-resume" data-te-ripple-init data-te-ripple-color="light"
                                        className="h">Read more</a>
                                </div>
                            </div>
                        </div>




                    </div>
                </section>

            </div>
        </div>
    )
}

export default Nus

