'use client'

import { useEffect, useState } from "react"

export default function Correct({
    i,
    SendFilterBtn,
    ReceiveOpenFilter,
    ReceiveCorrectBrightness,
    ReceiveCorrectContrast,
    ReceiveCorrectSaturation,
    ReceiveCorrectTemperature,
    ReceiveCorrectBlur,
    selectedFiles,
    ReceiveProcessNum,
    correctArr
}) {



    let allCorrection = [
        { kor: '밝기', eng: 'brightness' },
        { kor: '대비', eng: 'contrast' },
        { kor: '채도', eng: 'saturation' },
        { kor: '온도', eng: 'temperature' },
        { kor: '흐리게', eng: 'blur' }
    ]





    let [correctBtn, setCorrectBtn] = useState('')
    let [brightness, setBrightness] = useState(1)
    let [currentBrightness, setCurrentBrightness] = useState(1)
    let [contrast, setContrast] = useState(1)
    let [currentContrast, setCurrentContrast] = useState(1)
    let [saturation, setSaturation] = useState(1)
    let [currentSaturation, setCurrentSaturation] = useState(1)
    let [temperature, setTemperature] = useState(0)
    let [currentTemperature, setCurrentTemperature] = useState(0)
    let [blur, setBlur] = useState(0)
    let [currentBlur, setCurrentBlur] = useState(0)

    let [arr, setArr] = useState({ brightness, contrast, saturation, temperature, blur })


    useEffect(() => {
        setArr((e => ({ ...e, brightness, contrast, saturation, temperature, blur: blur })))
    }, [brightness, contrast, saturation, temperature, blur])

    useEffect(() => {
        setCurrentBrightness(correctArr[i].brightness)
        setCurrentContrast(correctArr[i].contrast)
        setCurrentSaturation(correctArr[i].saturation)
        setCurrentTemperature(correctArr[i].temperature)
        setCurrentBlur(correctArr[i].blur)
        setBrightness(correctArr[i].brightness)
        setContrast(correctArr[i].contrast)
        setSaturation(correctArr[i].saturation)
        setTemperature(correctArr[i].temperature)
        setBlur(correctArr[i].blur)
    },[])

    return (
        <div className={'correct-box correct-box' + i} style={{ display: 'none', position: 'absolute', left: '50%', transform: 'translate3d(-50%,0,0)', bottom: '30px' }}>
            <div className={'correct-wrap' + i}>
                <div className="correct-slide" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', position: 'absolute', overflowX: 'scroll', overflowY: 'hidden', height: 'max-content', marginTop: '-220px' }}>
                    {
                        allCorrection.map((a, t) =>
                            <div key={t} style={{ margin: '0 10px', height: 'max-content' }} onClick={() => {
                                setCorrectBtn(a.eng);
                                document.querySelector('.correct-wrap' + i).classList.add('hide')
                            }}>
                                <p style={{ textAlign: 'center', marginBottom: '10px' }}>{a.kor}</p>
                                <img style={{ width: '20vw' }} src={'img/' + a.eng + '.png'} alt="" />
                            </div>
                        )
                    }
                </div>
                <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => { SendFilterBtn('filter'); document.querySelector(`.correct-box${i}`).classList.remove('displayon') }}>필터</button>
                    <button onClick={() => { ReceiveOpenFilter(100); selectedFiles.length == 1 && ReceiveProcessNum(3);}}>완료</button>
                </div>
            </div>
            {
                correctBtn == 'brightness' ?
                    <div className="correct">
                        <div className="rollback" style={{ padding : '10px 20px', borderRadius : '10px', background : '#0a61b3', position : 'absolute', right : '0px', top : '-70px'}}
                        onClick={()=>{setBrightness(1); ReceiveCorrectBrightness(i, 1);  document.querySelector('.correct-box' + i + ' .brightness').value = 50}}
                        >재설정</div>
                        <div className="input-wrap" style={{ position: 'relative', marginBottom: '150px' }}>
                            <p style={{ position: 'absolute', transform: `translate3d(-${(brightness - 0.5) * 100}%,0,0)`, left: `${(brightness - 0.5) * 100}%` }}>{parseInt((brightness - 0.5) * 200 - 100)}</p>
                            <input className="brightness" type="range" min={0} max={100} onChange={(e) => {
                                setBrightness(0.5 + (e.target.value / 100));
                                ReceiveCorrectBrightness(i, brightness)
                            }} defaultValue={(currentBrightness - 0.5) * 100} style={{ marginTop: '35px' }} />
                        </div>

                        <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setBrightness(currentBrightness)
                                ReceiveCorrectBrightness(i, currentBrightness)
                            }}>취소</button>
                            <p>밝기</p>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setCurrentBrightness(brightness);
                                ReceiveCorrectBrightness(i, brightness)
                            }}>적용</button>
                        </div>
                    </div>
                    : null
            }

            {
                correctBtn == 'contrast' ?
                    <div className="correct">
                        <div className="rollback" style={{ padding : '10px 20px', borderRadius : '10px', background : '#0a61b3', position : 'absolute', right : '0px', top : '-70px'}}
                        onClick={()=>{setContrast(1); ReceiveCorrectContrast(i, 1);  document.querySelector('.correct-box' + i + ' .contrast').value = 0}}
                        >재설정</div>
                        <div className="input-wrap" style={{ position: 'relative', marginBottom: '150px' }}>
                            <p style={{ position: 'absolute', transform: `translate3d(-${(contrast - 1) * 100}%,0,0)`, left: `${(contrast - 1) * 100}%` }}>{parseInt((contrast - 1) * 100)}</p>
                            <input className="contrast" type="range" min={0} max={100} onChange={(e) => {
                                setContrast(1 + e.target.value / 100)
                                ReceiveCorrectContrast(i, contrast)
                            }} defaultValue={(currentContrast - 1) * 100} style={{ marginTop: '35px' }} />
                        </div>
                        <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setContrast(currentContrast)
                                ReceiveCorrectContrast(i, currentContrast)
                            }}>취소</button>
                            <p>대비</p>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setCurrentContrast(contrast)
                                ReceiveCorrectContrast(i, contrast)
                            }}>적용</button>
                        </div>
                    </div>
                    : null
            }

            {
                correctBtn == 'saturation' ?
                    <div className="correct">
                        <div className="rollback" style={{ padding : '10px 20px', borderRadius : '10px', background : '#0a61b3', position : 'absolute', right : '0px', top : '-70px'}}
                        onClick={()=>{setSaturation(1); ReceiveCorrectSaturation(i, 1);  document.querySelector('.correct-box' + i + ' .saturation').value = 50}}
                        >재설정</div>
                        <div className="input-wrap" style={{ position: 'relative', marginBottom: '150px' }}>
                            <p style={{ position: 'absolute', transform: `translate3d(-${(Math.pow(saturation, 1 / 2)) * 50}%,0,0)`, left: `${(Math.pow(saturation, 1 / 2)) * 50}%` }}>{parseInt((Math.pow(saturation, 1 / 2)) * 100 - 100)}</p>
                            <input className="saturation" type="range" min={0} max={100} onChange={(e) => {
                                setSaturation(0 + Math.pow(e.target.value / 50, 2))
                                ReceiveCorrectSaturation(i, saturation)
                            }} defaultValue={(Math.pow(currentSaturation, 1 / 2)) * 50} style={{ marginTop: '35px' }} />
                        </div>
                        <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setSaturation(currentSaturation)
                                ReceiveCorrectSaturation(i, currentSaturation)
                            }}>취소</button>
                            <p>채도</p>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setCurrentSaturation(saturation)
                                ReceiveCorrectSaturation(i, saturation)
                            }}>적용</button>
                        </div>
                    </div>
                    : null
            }



            {
                correctBtn == 'temperature' ?
                    <div className="correct">
                        <div className="rollback" style={{ padding : '10px 20px', borderRadius : '10px', background : '#0a61b3', position : 'absolute', right : '0px', top : '-70px'}}
                        onClick={()=>{setTemperature(0); ReceiveCorrectTemperature(i, 0);  document.querySelector('.correct-box' + i + ' .temperature').value = 50}}
                        >재설정</div>
                        <div className="input-wrap" style={{ position: 'relative', marginBottom: '150px' }}>
                            <p style={{ position: 'absolute', transform: `translate3d(-${temperature * 10 / 6 + 50}%,0,0)`, left: `${temperature * 10 / 6 + 50}%` }}>{parseInt(temperature * 10/3)}</p>
                            <input className="temperature" type="range" min={0} max={100} onChange={(e) => {
                                setTemperature(e.target.value * 0.6 - 30)
                                ReceiveCorrectTemperature(i, temperature)
                            }} defaultValue={currentTemperature * 10 / 6 + 50} style={{ marginTop: '35px' }} />
                            <div style={{ display : 'flex', justifyContent : 'space-between', marginTop : '10px', fontSize : '12px'}}><p>차갑게</p><p>따듯하게</p></div>
                        </div>
                        <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setTemperature(currentTemperature)
                                ReceiveCorrectTemperature(i, currentTemperature)
                            }}>취소</button>
                            <p>온도</p>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setCurrentTemperature(temperature)
                                ReceiveCorrectTemperature(i, temperature)
                            }}>적용</button>
                        </div>
                    </div>
                    : null
            }

            {
                correctBtn == 'blur' ?
                    <div className="correct">
                        <div className="rollback" style={{ padding : '10px 20px', borderRadius : '10px', background : '#0a61b3', position : 'absolute', right : '0px', top : '-70px'}}
                        onClick={()=>{setBlur(0); ReceiveCorrectBlur(i, 0);  document.querySelector('.correct-box' + i + ' .blur').value = 0}}
                        >재설정</div>
                        <div className="input-wrap" style={{ position: 'relative', marginBottom: '150px' }}>
                            <p style={{ position: 'absolute', transform: `translate3d(-${blur * 20}%,0,0)`, left: `${blur * 20}%` }}>{blur * 20}</p>
                            <input className="blur" type="range" min={0} max={100} onChange={(e) => {
                                setBlur(e.target.value / 20)
                                ReceiveCorrectBlur(i, blur)
                            }} defaultValue={currentBlur * 20} style={{ marginTop: '35px' }} />
                        </div>
                        <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setBlur(currentBlur)
                                ReceiveCorrectBlur(i, currentBlur)
                            }}>취소</button>
                            <p>흐림</p>
                            <button onClick={() => {
                                document.querySelector('.correct-wrap' + i).classList.remove('hide');
                                setCorrectBtn('');
                                setCurrentBlur(blur)
                                ReceiveCorrectBlur(i, blur)
                            }}>적용</button>
                        </div>
                    </div>
                    : null
            }
        </div>
    )
}