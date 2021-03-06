import nanoexpress from 'nanoexpress';
import axios from 'axios';
import {JSDOM} from 'jsdom';

const app = nanoexpress();

app.get('/code/:code', async (req, res) => {
    let trackingCode = req.params.code;
    try {
        const { data } = await axios.get(`https://www.linkcorreios.com.br/${trackingCode}`)
        const dom = new JSDOM(data, {
          runScripts: "dangerously",
          resources: "usable"
        });
        const { document } = dom.window;
        const firstResponseCardTracking= {
            status: document.querySelector('.linha_status li:nth-child(1) > b').innerHTML,
            date: document.querySelector('.linha_status li:nth-child(2)').innerHTML.replace('Data  : ', '').replace(' | Hora:', ''),
            local: document.querySelector('.linha_status li:nth-child(3)').innerHTML.replace('Local: ', '')
        };
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        return res.send(JSON.stringify(firstResponseCardTracking));
      } catch (error) {
        throw error;
      }

});

app.listen(process.env.PORT || 3000, '0.0.0.0');
