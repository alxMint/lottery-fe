import React, { useState, useEffect } from "react";
import web3 from './web3';
import lottery from './lottery';


function App() 
{
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
 
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    }
 
    fetchData();
  }, []);

  // enter the lottery
  async function handleSubmit(event) 
  {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Transazione in corso...");

    await lottery.methods.enter().send
    ({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
      data: web3.eth.abi.encodeFunctionSignature("enter()")
    });

    setMessage("Partecipazione inserita!");
  }


// pick a winner
async function handleClick() 
  {
    const accounts = await web3.eth.getAccounts();

    setMessage("Transazione in corso...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
      data: web3.eth.abi.encodeFunctionSignature("pickWinner()")
    });

    // const lastWinner = await web3.methods.lastWinner().call();

    const lastWinner = await lottery.methods.getLastWinner().call();

    console.log("last winner >> " + lastWinner);

    let message = `Il vincitore e' stato estratto > `;
    message+=lastWinner;


    setMessage(message);

  }



  return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          Il contratto e' gestito da {manager}.
          Al momento ci sono {" "}{players.length} partecipanti,
          che competono per vincire {" "} {web3.utils.fromWei(balance, 'ether')} ether.
        </p>
        <hr />

        <form onSubmit={handleSubmit}>
            <h4>Vuoi tentare la fortuna?</h4>
            <div>
              <label>Valore di ether da inserire</label>
                <input
                  value={value}
                  onChange={(event) => setValue(event.target.value) }
                />
            </div>
            <button>Inserisci</button>

        </form>

        <hr />

        <h4>Pronto ad estrarre un vincitore?</h4>
        <button onClick={handleClick}>Estrai vincitore</button>

        <hr />

        <h1>{message}</h1>
      </div>
    );
}

export default App;
