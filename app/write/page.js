'use client'


import { useCallback, useEffect, useMemo, useState } from "react";
import PreviewImg from "../previewimg/page";
import SelectedImgSlider from "../selectedimgslider/page";
import { useRouter } from "next/navigation";
import P2SelectedImgSlider from "../p2selectedimgslider/page";
import Correct from "../correct/page";
import P3SelectedImgSlider from "../p3selectedimgslider/page";
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
    params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME },
    region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export default function Write({user}) {

    let [selectedFiles, setSelectedFiles] = useState([]);
    let [processNum, setProcessNum] = useState(1)
    let [correctArr, setCorrectArr] = useState([])
    let [currentFilter, setCurrentFilter] = useState([])
    let [filter, setFilter] = useState([])
    let [pos, setPos] = useState([])
    let [filterNum, setFilterNum] = useState()
    let [openFilter, setOpenfilter] = useState(100)
    let [filterBtn, setFilterBtn] = useState('filter')
    let [content, setContent] = useState('')

    const [files1, setFiles1] = useState([]);
    const [files2, setFiles2] = useState([]);




    const copyfilter = []


    let router = useRouter()

    let posCopy = []
    let currentFilterCopy = []
    let filterCopy = []
    let correctClearArr = []




    

    const allFilter = useMemo(() => [
        'Normal', 'clarendon', 'gingham', 'lark', 'moon', 'reyes', 'juno',
        'slumber', 'crema', 'ludwig', 'aden', 'amaro', 'mayfair', 'rise',
        'hudson', 'valencia', 'x-proII', 'sierra', 'willow', 'lo-Fi',
        'inkwell', 'hefe', 'Nashville'
    ], []);

    const DeleteImg = (e) => {
        let copy = [...selectedFiles]
        copy.splice(e, 1)
        setSelectedFiles(copy)

        let copy2 = [...filter]
        copy2.splice(e, 1)
        setFilter(copy2)

        let copy3 = [...correctArr]
        copy3.splice(e, 1)
        setCorrectArr(copy3)
    }

    const SendFilterBtn = (e) => {
        setFilterBtn(e)
    }


    const ReceiveCorrectBrightness = (i, e) => {
        let copy = [...correctArr]
        copy[i].brightness = e
        setCorrectArr(copy)
    }

    const ReceiveCorrectContrast = (i, e) => {
        let copy = [...correctArr]
        copy[i].contrast = e
        setCorrectArr(copy)
    }

    const ReceiveCorrectSaturation = (i, e) => {
        let copy = [...correctArr]
        copy[i].saturation = e
        setCorrectArr(copy)
    }

    const ReceiveCorrectTemperature = (i, e) => {
        let copy = [...correctArr]
        copy[i].temperature = e
        setCorrectArr(copy)
    }

    const ReceiveCorrectBlur = (i, e) => {
        let copy = [...correctArr]
        copy[i].blur = e
        setCorrectArr(copy)
    }

    const ChangeFilterBtn = (e) => {
        setFilterBtn(e)
    }


    const Uppercase1 = (e) => {
        return e.charAt(0).toUpperCase() + e.slice(1)
    }

    const SetPos = (e) => {
        let copy = [...e]
        setPos(copy)
    }

    const SetFilter = (e) => {
        filterCopy.unshift(e)
        setFilter(filterCopy)
    }


    const ChangeFilter = (e) => {
        let copy = [...e]
        setFilter(copy)
    }

    const ChangeCurrentFilter = (e) => {
        let copy = [...e]
        setCurrentFilter(copy)
    }

    const ReceiveProcessNum = (e) => {
        setProcessNum(e)
    }

    const ReceiveFilterNum = (e) => {
        setFilterNum(e)
    }

    const ReceiveOpenFilter = (e) => {
        setOpenfilter(e)
    }

    const ReceiveFilterBtn = (e) => {
        setFilterBtn(e)
    }





    const handleFileChange = useCallback((e) => {
        const newFiles = Array.from(e.target.files).map(file => {
            file.preview = URL.createObjectURL(file);  // 미리보기 URL 생성
            return file;
        });
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);  // 파일 상태 업데이트
    }, []);






    const getContentType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            default:
                return 'application/octet-stream'; // Default fallback for unsupported types
        }
    };


    // 이미지 파일 선택 시 호출되는 함수



    const handleUpload = async () => {
        try {
            const uploadedFileKey = await Promise.all(
                selectedFiles.map(async (file) => {
                    const params = {
                        Body: file,
                        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                        Key: `name/${file.name}`,
                        ContentType: getContentType(file.name)
                    };
                    await s3.putObject(params).promise();
                    return `name/${file.name}`;
                })
            );
            const response = await fetch('/api/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: uploadedFileKey, content, correction: correctArr, filter, pos, user }),
            });

            if (response.ok) {
                const res = await response.json();
                window.location.href = '/'
            } else {
                throw new Error('Failed to send URLs to API');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };



    useEffect(() => {
        processNum < 1 ? router.push('/') : null
    }, [processNum])

    useEffect(() => {
    }, [filter])




    useEffect(() => {
        if (selectedFiles.length > 0) {
            const initialCorrectArr = selectedFiles.map(() => ({
                brightness: 1, contrast: 1, saturation: 1, temperature: 0, blur: 0
            }));
            const initialFilters = selectedFiles.map(() => 'Normal');
            setCorrectArr(initialCorrectArr);
            setFilter(initialFilters);
        }
    }, [selectedFiles]);

    useEffect(() => {
        const navbar = document.querySelector('.navbar');
        

        if (navbar) {
            navbar.style.display = 'none';
        }

        return () => {
            if (navbar) {
                navbar.style.display = 'flex';
            }
        };
    }, []);







    return (


        <div className="ds" style={{ width: '100%', overflow: 'hidden', height: '100vh',position:'relative', background : '#000' }}>

            {
                selectedFiles.length > 0 ?
                    processNum == 1 &&
                    <div className="write-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} >
                        <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/reject.png" style={{width:'25px'}} onClick={() => {
                            setProcessNum(processNum - 1)
                            setFilter([])
                        }}></img>
                        <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>자르기</p>
                        <button style={{fontWeight : 'bold', color : '#295ce9'}} onClick={() => {
                            setProcessNum(processNum + 1)
                            if (selectedFiles.length == 1) {
                                setFilterNum(0)
                                setOpenfilter(0)
                            }
                        }} >다음</button>
                    </div>
                    :
                    <div className="write-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} >
                        <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/reject.png" style={{width:'25px'}} onClick={() => {
                            setProcessNum(processNum - 1)
                            setFilter([])
                        }}></img>
                        <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>새 게시물</p>
                    </div>
            }


            {
                selectedFiles.length <= 0 && <label className="custom-file-input" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>
                    <span style={{ width: 'max-content' }}>이미지를 업로드해주세요</span>
                    <input
                        type="file"
                        name="file"
                        multiple
                        onChange={handleFileChange}
                        className="select-img"
                        style={{ display: 'none' }}
                    />
                </label>
            }

            {
                processNum == 1 &&
                <div
                    className="seleted-img-wrap"
                    style={{ display: 'flex', flexWrap: 'wrap', position: 'relative', height: 'calc(100vw - 80px)' }}>
                    {
                        selectedFiles.map((a, i) => {
                            let d = ''
                            posCopy.unshift(0)

                            if (i === 0) {
                                d = 'displayon';
                            } else {
                                d = ''
                            }
                            return (
                                <PreviewImg
                                    a={a}
                                    i={i}
                                    key={i}
                                    d={d}
                                    pos={pos}
                                    SetPos={SetPos}
                                    posCopy={posCopy}
                                />
                            )
                        })
                    }
                </div>
            }
            {
                processNum == 1 &&
                selectedFiles.length > 1 && <div className="selected-img-slide-wrap" style={{ position: 'relative', marginTop: '30px' }} >
                    <div className="selected-img-slide" style={{ display: 'flex' }}>
                        {
                            selectedFiles.map((a, i) => (
                                <SelectedImgSlider a={a} i={i} key={i} />
                            ))

                        }
                    </div>
                </div>

            }



            {
                processNum == 2 &&
                <div className="write-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} >
                    <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/reject.png" style={{width:'25px'}} onClick={() => {
                        setProcessNum(processNum - 1)
                        selectedFiles.forEach((a, i) => {
                            correctClearArr.unshift({ brightness: 1, contrast: 1, saturation: 1, temperature: 0, blur: 0 })
                            copyfilter.unshift('Normal')
                        })
                        if (JSON.stringify(correctArr) !== JSON.stringify(correctClearArr) || JSON.stringify(filter) !== JSON.stringify(copyfilter)) {
                            let boolean = window.confirm('작업내용을 임시저장하시겠습니까?')
                            if (!boolean) {
                                setCorrectArr(correctClearArr)
                                setFilter([])
                            }
                        }
                    }}></img>
                    <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>꾸미기</p>
                    <button style={{fontWeight : 'bold', color : '#295ce9'}}  onClick={() => {
                        setProcessNum(processNum + 1)
                        // setFilter(currentFilter)
                    }} >다음</button>
                </div>
            }

            {
                processNum == 2 && selectedFiles.length > 1 &&
                <div className="p2-selected-img-slide-wrap" style={{ position: 'relative', marginTop: '30px', }}>
                    <div className="p2-seleted-img-slide" style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden' }}
                    >
                        {
                            selectedFiles.map((a, i) => (
                                <P2SelectedImgSlider
                                    a={a}
                                    i={i}
                                    key={i}
                                    filter={filter}
                                    ReceiveFilterNum={ReceiveFilterNum}
                                    ReceiveOpenFilter={ReceiveOpenFilter}
                                    ChangeCurrentFilter={ChangeCurrentFilter}
                                    ChangeFilterBtn={ChangeFilterBtn}
                                    correctArr={correctArr}
                                    pos={pos}
                                    DeleteImg={DeleteImg}
                                    selectedFiles={selectedFiles}
                                />
                            ))
                        }
                    </div>
                </div>

            }

            {
                processNum == 2 &&
                selectedFiles.length > 1
                && <div className="p2-change-all-filter-slide-wrap" style={{ position: 'relative', marginTop: '30px' }}>
                    <img src={selectedFiles[0].preview} alt="" style={{ width: '25vw', opacity: 0, pointerEvents: 'none' }} />
                    <div className="p2-change-all-filter-slide" style={{ display: 'flex', overflowX: 'scroll' }}

                    >
                        {
                            allFilter.map((a, i) => (
                                <div className={"p2-change-all-filter-slider " + a} key={i} onClick={(e) => {
                                    e.stopPropagation()
                                    document.querySelectorAll('.filter-wrap').forEach(() => {
                                        SetFilter(a)
                                    })
                                }}

                                    style={{ flex: '0 0 calc(25vw + 20px)' }}
                                >
                                    <p style={{ pointerEvents: 'none' }}>{Uppercase1(a)}</p>
                                    <img
                                        src={selectedFiles[0].preview} alt={a} style={{ width: '25vw', margin: '0 10px', pointerEvents: 'none' }}
                                    />
                                </div>
                            ))
                        }
                    </div>
                   
                </div>

            }

            {


                openFilter == 0 &&
                <div style={{ position: 'fixed', top: `${openFilter}%`, transition: '.2s 0.1s ease-out', background: '#000', width: '100%', height: '100%' }}>
                    <div className="write-nav" style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '50px', width: '100vw' }}>
                        <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/reject.png" style={{width:'25px'}} onClick={() => {
                            setOpenfilter(100)
                            setFilterBtn('filter')
                            setFilter(currentFilter)
                            if (selectedFiles.length == 1) {
                                setProcessNum(1)
                                selectedFiles.forEach((a, i) => {
                                    correctClearArr.unshift({ brightness: 1, contrast: 1, saturation: 1, temperature: 0, blur: 0 })
                                    copyfilter.unshift('Normal')
                                })
                                if (JSON.stringify(correctArr) !== JSON.stringify(correctClearArr) || JSON.stringify(filter) !== JSON.stringify(copyfilter)) {
                                    let boolean = window.confirm('작업내용을 임시저장하시겠습니까?')
                                    if (!boolean) {
                                        setCorrectArr(correctClearArr)
                                        setFilter([])
                                    }
                                }
                            }
                        }}></img>


                        {
                            filterBtn == 'filter' ?
                                <h4 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>필터</h4>
                                : <h4 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>수정</h4>
                        }

                    </div>
                    <div style={{ margin: '50px 0' }}>
                        <div
                            style={{
                                filter: `
                                    brightness(${correctArr[filterNum].brightness}) 
                                    contrast(${correctArr[filterNum].contrast}) 
                                    saturate(${correctArr[filterNum].saturation}) 
                                    hue-rotate(${correctArr[filterNum].temperature}deg) 
                                    blur(${correctArr[filterNum].blur}px)`
                            }}
                        >
                            <div className={`${filter[filterNum]}`} style={{ position: 'relative', width: 'calc(100vw - 80px)', height: 'calc(100vw - 80px)', overflow: 'hidden', margin: '0 40px' }}>
                                <img
                                    src={selectedFiles[filterNum].preview} style={{ width: 'calc(100vw - 80px)', position: 'absolute', left: '50%', top: `${pos[filterNum]}px`, transform: 'translate3d(-50%,-50%,0)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {
                        filterBtn == 'filter' &&
                        <div className="p2-slider-filter-slide-wrap" style={{ marginTop: '100px' }}>
                            <div className="p2-slider-filter-slide" style={{ display: 'flex', overflowX: 'scroll' }}>
                                {allFilter.map((t, k) => (
                                    <div className={"p2-change-all-filter-slider " + t} key={k} onClick={() => {
                                        let copy = [...filter];
                                        copy[filterNum] = t;
                                        ChangeFilter(copy)
                                    }}>
                                        <p>{Uppercase1(t)}</p>
                                        <img
                                            src={selectedFiles[filterNum].preview} alt={t} style={{ width: '25vw', margin: '0 5px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    }



                    {
                        filterBtn == 'filter' &&
                        <div className="p2-filter-btn-wrap" style={{ display: 'flex', width: '100vw', padding: '0 20px', justifyContent: 'space-between', position: 'absolute', bottom: '30px' }}>
                            <button onClick={() => { setFilterBtn(`correct${filterNum}`) }}>수정</button>
                            <button onClick={() => {
                                setOpenfilter(100);
                                selectedFiles.length == 1 && setProcessNum(3)
                            }}>완료</button>
                        </div>

                    }

                    {
                        selectedFiles.map((a, i) =>
                            <Correct
                                key={i}
                                i={i}
                                ReceiveCorrectBrightness={ReceiveCorrectBrightness}
                                ReceiveCorrectContrast={ReceiveCorrectContrast}
                                ReceiveCorrectSaturation={ReceiveCorrectSaturation}
                                ReceiveCorrectTemperature={ReceiveCorrectTemperature}
                                ReceiveCorrectBlur={ReceiveCorrectBlur}
                                SendFilterBtn={SendFilterBtn}
                                ReceiveOpenFilter={ReceiveOpenFilter}
                                selectedFiles={selectedFiles}
                                ReceiveProcessNum={ReceiveProcessNum}
                                ReceiveFilterBtn={ReceiveFilterBtn}
                                correctArr={correctArr}
                            />
                        )

                    }

                    {

                        selectedFiles.length > 1 ?
                            selectedFiles.map((a, i) => {
                                console.log('발동함')
                                filterBtn == `correct${i}` &&
                                    document.querySelector(`.correct-box${i}`).classList.add('displayon')
    
                            })
                        :
                            filterBtn == `correct0` &&
                                    document.querySelector(`.correct-box0`).classList.add('displayon')
                        
                        
                    }



                </div>

            }
            {
                processNum == 3 && <div className="p-20">
                    <div className="write-nav" style={{position :'relative', display:'flex', alignItems: 'center', padding : 0}}>
                    <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/back.png" style={{width:'25px'}} onClick={() => {
                        setProcessNum(2);
                        if (selectedFiles.length == 1) {
                            setOpenfilter(0)
                            setFilterBtn('filter')
                        }
                    }} ></img>
                    <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>새 게시물</p>

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="p3-selected-img-slide-wrap" style={{ position: 'relative', margin: '20px 0' }}>
                            <div className="p3-seleted-img-slide" style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden', width: '' }}
                            >
                                {
                                    selectedFiles.map((a, i) => (
                                        <P3SelectedImgSlider
                                            a={a}
                                            i={i}
                                            key={i}
                                            filter={filter}
                                            ReceiveFilterNum={ReceiveFilterNum}
                                            ReceiveOpenFilter={ReceiveOpenFilter}
                                            ChangeCurrentFilter={ChangeCurrentFilter}
                                            ChangeFilterBtn={ChangeFilterBtn}
                                            correctArr={correctArr}
                                            pos={pos}
                                            DeleteImg={DeleteImg}
                                            selectedFiles={selectedFiles}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                        <h4>글작성페이지</h4>
                        <textarea wrap="physical" id="content" type="text" placeholder="문구를 작성하세요..." rows={5} style={{ padding: '5px' }} onChange={(e) => { setContent(e.target.value) }} />
                        <button style={{ marginTop : '10px', padding :'10px 0', width:'100%', background: '#295ce9'}} type="submit" onClick={() => {
                            if (document.getElementById('content').value == '') { alert('상세내용을 입력해주세요') }
                            handleUpload()
                        }}>업로드하기</button>
                    </div>

                </div>
            }
        </div>

    )
}