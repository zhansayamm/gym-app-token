import { useState, useEffect } from "react";
import "./App.css";
import { getContract } from "./contract";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 подключение MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    setError("");
  };

  // 🔥 авто-проверка пользователя
  const checkUser = async () => {
    try {
      const contract = await getContract();
      const isReg = await contract.isRegistered(account);

      if (isReg) {
        const data = await contract.getUser(account);
        setProfile({
          username: data[0],
          email: data[1],
          address: data[2],
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (account) {
      checkUser();
    }
  }, [account]);

  // 👤 регистрация
  const register = async () => {
    try {
      setLoading(true);
      setError("");

      const contract = await getContract();
      const tx = await contract.register(username, email);
      await tx.wait();

      await checkUser();
    } catch (err) {
      setError("User already registered or invalid data");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAccount("");
    setProfile(null);
    setError("");
  };

  return (
    <div className="container">
      <h1>🏋️ Gym App</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <p>
            <b>Account:</b> {account}
          </p>

          {/* ❌ ошибки */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* 👤 если НЕ зарегистрирован */}
          {!profile && (
            <>
              <h3>Register</h3>

              <input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button onClick={register} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}

          {/* ✅ если зарегистрирован */}
          {profile && (
            <div className="profile">
              <h3>Profile</h3>
              <p>
                <b>Username:</b> {profile.username}
              </p>
              <p>
                <b>Email:</b> {profile.email}
              </p>
              <p>
                <b>Address:</b> {profile.address}
              </p>
            </div>
          )}

          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
}

export default App;
