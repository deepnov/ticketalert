// ==UserScript==
// @name         Satyam
// @namespace     http://thecinema.in/
// @description   script to play sound if ticket is available
// @include       http://thecinema.in/*
// @resource      GMwavaudio http://gmflowplayer.googlecode.com/files/notify.wav
// ==/UserScript==

var oggB64 = GM_getResourceURL("GMwavaudio");
var au = document.createElement('audio');
var ausrc = 'data:audio/wav;base64,'+oggB64.split('data:application/octet-stream;base64,')[1];
au.setAttribute('src', ausrc);
au.setAttribute('id', 'GMwavaudio');
document.body.appendChild(au);

var intval=''; 
console.log('scriptloaded1');
intval=setInterval(function()
{
var http = new XMLHttpRequest();
var url = '/webWCF/AjaxBackService.svc/GetTicketDetail';
var params = '{"movieID":"ST00001265","date":"Friday |18 December"}';

http.open("POST", url, true);

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "application/json");
http.setRequestHeader("Content-length", params.length);
http.setRequestHeader("Connection", "close");

http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {

                                var json=eval('(' +http.responseText+')');
                if(json&&json.d&&json.d.length>0)
                {
                    for(var i=0;i<json.d.length;i++)
                    {
                        if(json.d[i].DaySessionNo=="4"&&json.d[i].TicketTypes)
                        {
                            for(var j=0;j<json.d[i].TicketTypes.length;j++)
                            {
                               au.play();
                               
                                 if(intval!="")
                                  clearInterval(intval);

                                var ticket=json.d[i].TicketTypes[j]; 
                                if(ticket)
                                {             
                                    console.log(ticket.SessionID);
                                    console.log(ticket.SessionName);
                                    console.log(ticket.TicketDetail);
                                    console.log(ticket.Time);
                                }
                            }
                        }
                    }
                }
                else
                {
                    console.log('NA at '+Date());
                }
                }
}
http.send(params);
}
,30000);
