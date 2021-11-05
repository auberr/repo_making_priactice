$(document).ready(function () {

    // 시계 세팅
    setClock();
    let timerId = setInterval(setClock, 1000);

    // 확진자 현황 차트
    const confirmedCaseChartEl = document.getElementById('confirmedCaseChart').getContext('2d')

    // 백신 접종률 차트
    const vaccinatedChartEl = document.getElementById('vaccinatedChart').getContext('2d')

    // 확진자 데이터 가져오기
    getConfirmedCaseData(confirmedCaseChartEl);

    // 백신 접종률 데이터 가져오기
    getVaccinatedData(vaccinatedChartEl);

    // 위드코로나 버튼활성화
    const tabBtn = $(".slide_btn > div");
    tabBtn.click(function (e) {
        e.preventDefault();
        let target = $(this);
        let index = target.index();
        tabBtn.removeClass("btn_active");
        target.addClass("btn_active");

    });

    // 위드코로나 우측으로 슬라이드
    document.querySelector('.btn_2').addEventListener('click', function () {
        document.querySelector('.withcorona_cont').style.transform = 'translate(-25.99vw)';
    })

    document.querySelector('.btn_3').addEventListener('click', function () {
        document.querySelector('.withcorona_cont').style.transform = 'translate(-52vw)';
    })

    document.querySelector('.btn_1').addEventListener('click', function () {
        document.querySelector('.withcorona_cont').style.transform = 'translate(-0vw)';
    })
})

function setClock() {
    const event = new Date();
    $('#top_clock').text(event.toString());
}

function getConfirmedCaseData(chartEl) {
    $.ajax({
        url: "http://openapi.seoul.go.kr:8088/63525543576f6e65363864706d7852/json/TbCorona19CountStatusJCG/1/5/2021.08.01.00",
        type: "GET",
        dataType: "json",
        success: function (response) {
            let seoul = response["TbCorona19CountStatusJCG"]["row"];
            let ddm_total = seoul[0]["DDM"]
            let ddm_day = seoul[0]["DDMADD"]
            let temp_html = `${ddm_total} <br>
            ${ddm_day}`

            const chartData = {
                labels: Object.keys(seoul[0]),
                data: Object.values(seoul[0]).map(x => Number(x)), // 실제 데이터 값
            }

            initializeConfirmedCaseChart(chartEl, chartData);
        }
    })
}

function getVaccinatedData(chartEl) {
    // TODO : 백신 접종률 데이터 가져오기
    // ajax call

    const chartData = {
        labels: '',
        data: ''
    }
    initializeVaccinatedChart(chartEl, chartData);
}

function initializeConfirmedCaseChart(chartEl, chartData) {
    let chart = new Chart(chartEl, {
        plugins: [ChartDataLabels],
        type: 'bar', // 차트 종류
        data: { // 차트에 들어갈 데이터
            labels: chartData.labels, // 레이블 이름
            datasets: [{
                label: '확진자 수',
                data: chartData.data, // 실제 데이터 값
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ], // 그래프 배경색
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ], // 그래프 경계선 색상
                // barThickness: 5, // 바의 굵기 지정, 설정될 경우 borderWidth와 barPercentage(아래 두 개)를 무시하고 적용됩니다.
                borderWidth: 1, //테두리 굵기
                barPercentage: 0.5, //그래프 한 칸에서 막대가 차지하는 비율 (width)
                // categoryPercentage: 1, //그래프 전체에서 한 칸의 비율
                base: 0, // 그래프의 기준 축
                datalabels: {
                    labels: {
                        name: {
                            align: 'start',
                            anchor: 'start',
                            offset: '5',
                            font: { size: 16 },
                            formatter: function (value, ctx) {
                                return ctx.chart.data.labels[ctx.dataIndex];
                            }
                        }, // name = 레이블 이름의 위치, 크기, 색, 데이터 형식 등
                        value: {
                            align: 'end',
                            anchor: 'end',
                            offset: '2',
                            font: { size: 16 },
                            // color: function (ctx) {
                            //     let value = ctx.dataset.data[ctx.dataIndex];
                            //     return 'white'
                            // },
                            formatter: function (value, ctx) {
                                return Math.round(value);
                            }
                        } // value = 그래프 값의 위치, 크기, 색, 데이터 형식 등
                    }
                }
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    color: 'white',
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    },
                    font: {
                        weight: 'bold'
                    },
                    formatter: Math.round
                },
                title: {
                    display: false,
                    text: '지역별 확진자 수', //타이틀 가시화, 텍스트
                },
                legend: {
                    display: false //범례 비가시화
                }
            }, // plugin = 기타 다양한 기능들 - 현재 폰트, 제목, 범례 조정
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false,
                    suggestedMin: -2
                }
            }, // 그래프의 축 정보 - 축 안보이게 하기, y축 5만큼 내리기 되어있음.
            layout: {
                padding: 10
            },
            devicePixelRatio: 2
        }
    });
}

function initializeVaccinatedChart(chartEl, chartData) {
    let chart = new Chart(chartEl, {
        type: 'doughnut', // 차트 종류
        data: { // 차트에 들어갈 데이터
            labels: [
                '미접종자', '접종자' // 레이블 이름
            ],
            datasets: [
                { //데이터
                    label: 'Vaccination rate', //차트 제목
                    data: [

                    ],
                    backgroundColor: [
                        // 그래프 배경색
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderColor: [
                        // 그래프 경계선 색상
                        'rgba(255, 255, 255, 0)',
                        'rgba(54, 162, 235, 0)',
                    ],
                    borderWidth: 1 //경계선 굵기
                    ,
                    hoverOffset: 5 //마우스 올릴 때의 애니메이션
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: false,
                    text: '' //그래프 제목
                },
                legend: {
                    display: false //범례 비가시화
                }
            },// plugin = 기타 다양한 기능들 - 현재 제목, 범례 조정
            layout: {
                padding: 10
            },
            devicePixelRatio: 2
        }
    });
}