import { useEffect, useState } from "react";

function App() {
    // 외부에서 데이터를 받아다가 화면을 출력해주는 프로그램
    // 초기랜더링 -> 데이터를 받아오고 -> 데이터로 화면을 갱신

    // state. 우리는 이 화면을 작성할 때 어떤 state가 필요할까?
    const [loading, setLoading] = useState(true); // 어떠한 목적의 state : loading 관리용 state
    // 데이터를 불러오는 중에는 true, 데이터가 도착되면 false

    const [coins, setCoins] = useState([]); // 어떠한 목적의 state : 외부에서 받아오는 데이터를 저장할 목적의 state
    const [selectedId, setSelectedId] = useState(""); // 사용자가 select에서 선택한 값ㅇ를 저자아할 state

    const selectedCoin = coins.find(value => {
        return value.id === selectedId;
    });

    useEffect(() => {
        // 초기랜더링이 끝나고 실행해야해라고
        // 시점에서 실행
        // useEffect(() => {}, []);
        // fetch() : 외부에서 데이터를 받아오는 비동기함수, 비동기함수는 .then()과, .catch()로 처리해야함
        // .then(함수) : fetch() 가 완료되면 실행되는 함수를 적어야함 => then()은 메소드 체인으로 여러개를 적어줄 수 있음
        // .catch(함수) : fetch()가 실패하면 실행되는 함수를 적어야함 => catch
        fetch("https://api.coinlore.net/api/tickers/")
            .then(response => {
                return response.json();
            }) // 성공하면, 그 데이터를 json형태로 가공
            .then(json => {
                setCoins(json.data);
                setLoading(false);
            })
            .catch(error => {
                console.log("데이터 로드 실패 : ", error);
                setLoading(false);
            });
    }, []); // 최초 랜더링이 끝난 이후 1회 무조건 실행

    return (
        <div>
            <h1>The Coins! ({coins.length})</h1>
            <hr />
            {loading ? (
                <strong>데이터를 불러오는 중입니다....</strong>
            ) : (
                <div>
                    <select
                        value={selectedId}
                        onChange={event => {
                            // 사용자가 변경한 값을 저장해야 함
                            setSelectedId(event.target.value);
                        }}>
                        {coins.map((value, index) => {
                            return (
                                <option key={index} value={value.id}>
                                    {value.name} ({value.symbol})
                                </option>
                            );
                        })}
                    </select>

                    {selectedCoin && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "20px",
                                border: "1px solid #ddfd",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                maxWidth: "400px",
                            }}>
                            <h2 style={{ marginBottom: "15px" }}>
                                {selectedCoin.name}{" "}
                                <span style={{ color: "gray", fontSize: "1rem" }}>
                                    {selectedCoin.symbol}
                                </span>
                            </h2>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                }}>
                                <li>
                                    {/* Number 타입에 쓸 수 있는 메소드 .toFixed(숫자) : 소숫점 갯수  */}
                                    <strong>현재 가격:</strong> ${" "}
                                    {Number(selectedCoin.price_usd).toFixed(0)}
                                </li>
                                <li>
                                    {/* Number 타입에 쓸 수 있는 메소드 toLocaleString() : 숫자에 식별 콬마를 넣어 문자열로 반환  */}
                                    {/*   => 한국 컴퓨터에서 열면 , 로 숫잔를 나누는데 중도에서 열면 . 로 숫자를 나눔 */}
                                    <strong>시가 총액:</strong> ${" "}
                                    {Number(selectedCoin.market_cap_usd).toLocaleString()}
                                </li>
                                <li>
                                    <strong>1시간 변동률:</strong>
                                    <span
                                        style={{
                                            color:
                                                selectedCoin.percent_change_1h >= 0
                                                    ? "red"
                                                    : "blue",
                                        }}>
                                        {" "}
                                        {selectedCoin.percent_change_1h}%
                                    </span>
                                </li>
                                <li>
                                    <strong>24시간 변동률:</strong>
                                    <span
                                        style={{
                                            color:
                                                selectedCoin.percent_change_24h >= 0
                                                    ? "red"
                                                    : "blue",
                                        }}>
                                        {" "}
                                        {selectedCoin.percent_change_24h}%
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
