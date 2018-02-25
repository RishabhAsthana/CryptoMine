import React, { Component } from 'react';
import './App.css';
import Property from './components/property/property';
import Progress from './components/progress/progress';
import Coin from './components/coin/coin';
import axios from 'axios';


//let current = "";
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

class App extends Component {

  constructor() {
    super();
    this.state = {
      machine_prices: [2,4,9,10,11,24,56,89,100,120],
      machines_owned: [0,0,0,0,0],
      usd_amt: 10000,
      btc_amt: 0.00,
      eth_amt: 0.00,
      xrp_amt: 0.00,
    }
    this.buy_machine = this.buy_machine.bind(this);
    this.buy_btc = this.buy_btc.bind(this);
    this.sell_btc = this.sell_btc.bind(this);
    this.buy_eth = this.buy_eth.bind(this);
    this.sell_eth = this.sell_eth.bind(this);
    this.buy_xrp = this.buy_xrp.bind(this);
    this.sell_xrp = this.sell_xrp.bind(this);
  }
  
  buy_machine(index){
      let current = this.state.machines_owned;
      current[index] += 1;
      this.setState({machines_owned: current});
  }
    
  buy_btc(){
      let current_usd = this.state.usd_amt;
      let current_btc_val = this.state.btc;
      let current_btc_amt = this.state.btc_amt;
      if (current_usd >= current_btc_val){
          this.setState({usd_amt: (current_usd-current_btc_val), btc_amt: current_btc_amt+1})
      }
  }
  sell_btc(){
      let current_usd = this.state.usd_amt;
      let current_btc_val = this.state.btc;
      let current_btc_amt = this.state.btc_amt;
      if (current_btc_amt >= 1){
          this.setState({usd_amt: (current_usd+current_btc_val), btc_amt: current_btc_amt-1})
      }
  }
    
  buy_eth(){
      let current_usd = this.state.usd_amt;
      let current_eth_val = this.state.eth;
      let current_eth_amt = this.state.eth_amt;
      if (current_usd >= current_eth_val){
          this.setState({usd_amt: (current_usd-current_eth_val), eth_amt: current_eth_amt+1})
      }
  }
  sell_eth(){
      let current_usd = this.state.usd_amt;
      let current_eth_val = this.state.eth;
      let current_eth_amt = this.state.eth_amt;
      if (current_eth_amt >= 1){
          this.setState({usd_amt: (current_usd+current_eth_val), eth_amt: current_eth_amt-1})
      }
  }

  buy_xrp(){
      let current_usd = this.state.usd_amt;
      let current_xrp_val = this.state.xrp;
      let current_xrp_amt = this.state.xrp_amt;
      if (current_usd >= current_xrp_val){
          this.setState({usd_amt: (current_usd-current_xrp_val), xrp_amt: current_xrp_amt+1})
      }
  }
  sell_xrp(){
      let current_usd = this.state.usd_amt;
      let current_xrp_val = this.state.xrp;
      let current_xrp_amt = this.state.xrp_amt;
      if (current_xrp_amt >= 1){
          this.setState({usd_amt: (current_usd+current_xrp_val), xrp_amt: current_xrp_amt-1})
      }
  }

  componentDidMount(){
      var self = this;

      setInterval(function(){
          
          var usd_amt = self.state.usd_amt | 0;
          var btc_amt = self.state.btc_amt | 0;
          var eth_amt = self.state.eth_amt | 0;
          var xrp_amt = self.state.xrp_amt | 0;
          var machines = self.state.machines_owned;

          axios.get("http://localhost:8080/")
          .then(function(response){
           let data = response.data;
           let new_btc_amt = btc_amt + machines.map(function(item, index){return item*(1/data.difficulty)}).reduce(reducer);
           let new_eth_amt = eth_amt + machines.map(function(item, index){return item*((Math.random()*2*(index+1) )/data.difficulty)}).reduce(reducer);
           let new_xrp_amt = xrp_amt + machines.map(function(item, index){return item*((Math.random()*10*(index+1))/data.difficulty)}).reduce(reducer);
           let net_asset_value = usd_amt + (new_btc_amt * data.btc) + (new_eth_amt * data.eth) + (new_xrp_amt * data.xrp);
           let date = data.timestamp * 1000;
           date = new Date(date);
           date = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear();
              
          self.setState({btc: data.btc, eth: data.eth, xrp: data.xrp, timestamp: date, difficulty: data.difficulty, total: net_asset_value, btc_amt: new_btc_amt, eth_amt: new_eth_amt, xrp_amt: new_xrp_amt});
          //console.log(JSON.stringify(self.state))
          });
      },1000);
  }
    
  
    
  render() {
    let vals = [this.state.btc, this.state.xrp, this.state.eth];
    let coin_amounts = [this.state.btc_amt, this.state.eth_amt, this.state.xrp_amt, this.state.usd_amt];
    return (
      <div className="main">
        <div className="main-left">
          <div className="assets">
            <Property total={this.state.total} amounts={coin_amounts}/>
          </div>
          <div className="coins">
            <Coin coin_values={vals} 
                fns = {
                    [ 
                      {buy:this.buy_btc, sell:this.sell_btc},
                      {buy:this.buy_xrp, sell:this.sell_xrp},
                      {buy:this.buy_eth, sell:this.sell_eth}
                    ]
                } 
                date={this.state.timestamp}
                />
            {/*<Coin/>*/}
          </div>
        </div>
        <div className="main-right">
          <div className="mining">
            <Progress callback={this.buy_machine}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
