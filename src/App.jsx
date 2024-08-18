import { useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  background-color: #1e1e1e;
  width: 100vw;
  height: 100vh;
`;
const Header = styled.header`
  padding: 30px 0;
`;
const Title = styled.h1`
  font-size: 48px;
  text-align: center;
`;
const Main = styled.main`
  width: 70%;
  margin: 0 auto;
  font-size: 18px;
`;
const Chat = styled.div`
  max-height: calc(100vh - 220px);
  overflow-y: scroll;
  scrollbar-width: none;
`;
const QABox = styled.div`
  text-align: right;
`;
const Question = styled.p`
  color: #fff;
  text-align: right;
  padding: 10px 20px;
  background: #444444;
  display: inline-block;
  margin-left: auto;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Answer = styled.p`
  color: #fff;
  padding: 10px 20px;
  width: 70%;
  text-align: left;
  margin-bottom: 20px;
  display: flex;
  line-height: 1.5;
`;
const Emoji = styled.span`
  margin-right: 10px;
  font-size: 30px;
`;
const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: fixed;
  bottom: 40px;
  width: 70%;
`;
const Input = styled.textarea`
  display: block;
  flex-grow: 1;
  resize: none;
  font-size: 14px;
  height: 40px;
  padding: 10px;
  border-radius: 10px;
`;
const Submit = styled.button`
  height: 40px;
`;
function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [QA, setQA] = useState([]);

  const fetchCustomGPTResponse = async (inputText) => {
    const apiKey = import.meta.env.VITE_OPEN_AI_KEY;
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    try {
      //complete fetch
      const res = await fetch();

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setQA((prev) => {
          return prev.map((item, index) => {
            if (item.question == input && item.id == index) {
              return { ...item, answer: data.choices[0].message.content };
            }
            return item;
          });
        });
        setError("");
      } else if (res.status === 429) {
        console.error("Too many requests. Please try again later.");
        setError("Too many requests. Please try again later.");
      } else {
        console.log(res.json());
        console.error("Error:", res.status, res.statusText);
        setError("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleSendClick = () => {
    if (input.trim()) {
      fetchCustomGPTResponse(input);
      setQA((prev) => [...prev, { question: input, answer: "", id: QA.length }]);
      setInput("");
    }
  };

  return (
    <Wrap>
      <Header>
        <Title>😈</Title>
      </Header>
      <Main>
        <Chat>
          {QA &&
            QA.map((item) => (
              <QABox key={item.id}>
                <Question>{item.question}</Question>
                <Answer>
                  <Emoji>😈</Emoji> {item.answer}
                </Answer>
              </QABox>
            ))}
        </Chat>

        <InputBox>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask GPT-4o-Mini something..." />
          <Submit onClick={handleSendClick}>Send</Submit>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </InputBox>
      </Main>
    </Wrap>
  );
}

export default App;
