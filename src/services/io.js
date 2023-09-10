import ping from 'ping';

export const createIOServer = (io)=> {

  const nodeData = [
    {id:1, label:'Cloudflur', status:'up', ip:'1.0.0.1',time:'',lency:''},
    {id:2, label:'Dns.Google', status:'up', ip:'8.8.8.8',time:'',lency:''},
    {id:3, label:'test3', status:'up', ip:'192.168.0.1',time:'',lency:''},
  ]

  const pingAndupdate =()=> {
    Object.values(nodeData).forEach((node)=>{
      const start = new Date();
      ping.sys.probe(node.ip, (isAlive) => {
        const updateStatus = isAlive ? 'up' : 'down';
        const isTime = Date.now() - start.getTime();
        io.emit('nodeStatus', {
          id: node.id,
          status: updateStatus,
          ip: node.ip,
          label: node.label,
          lency: isTime + 'ms',
        });
      });
    })
  }
  setInterval(() => pingAndupdate(), 5000)
}
