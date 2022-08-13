import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

type IProps = {};
const Home: NextPage = (props: IProps) => {
  const [isFirst, setIsFirst] = useState(true);
  const [fakeDate, setFakeDate] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const id = "id" + Math.random().toString(16).slice(2);
    const value = textAreaValue;
    const typeName = inputValue;

    const res = await axios.post("/api/generate", {
      value,
      id: id,
      typeName,
    });
    setLoading(false);
    setFakeDate(JSON.stringify(res.data, undefined, 2));
  };

  useEffect(() => {
    if (typeof textAreaValue === "string" && textAreaValue.trim() !== "") {
      setIsFirst(false);
    }
  }, [textAreaValue]);

  useEffect(() => {
    let hasFirstFound = false;
    const arr: string[] = [];
    const temp = textAreaValue.split(" ");
    for (let i = 0; i < temp.length; i++) {
      if (i > 0 && (temp[i - 1] === "type" || temp[i - 1] === "interface")) {
        if (isFirst && !hasFirstFound) {
          hasFirstFound = true;
          setInputValue(temp[i]);
        }
        arr.push(temp[i]);
      }
    }
    setOptions(arr);
  }, [inputValue, isFirst, textAreaValue]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Make fake data</title>
        <meta name="description" content="Make fake data by typescript types" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Fake Data Generator</h1>

        <div className={styles.typeInputWrapper}>
          <label className={styles.labelStyle}>Type of Interface name</label>
          <select
            className={styles.typeInput}
            title={"type"}
            name={"type"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          >
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <label className={styles.labelStyle}>Types</label>
        <textarea
          id="types"
          title={"types"}
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          className={styles.data}
          rows={20}
        />
        <button
          disabled={!Boolean(textAreaValue)}
          className={styles.sendButton}
          type="button"
          onClick={handleSend}
        >
          {loading ? (
            <div className={styles.spinnerWrapper}>
              <TailSpin color="#ffffff" height={19} width={19} />
            </div>
          ) : (
            "Get fake data"
          )}
        </button>
        <label className={styles.labelStyle}>Fake data</label>
        <textarea
          id="fake-data"
          title={"fake data"}
          value={fakeDate}
          className={styles.data}
          rows={20}
          placeholder="fake data"
        />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context
) => {
  return {
    props: {},
  };
};

export default Home;
