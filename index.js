const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const jsdom = require('jsdom')
const { json } = require('express')
const { JSDOM } = jsdom

const app = express();
const port = 8080;

app.use(cors())
app.use(express.static('views'))
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);


app.get('/about', (req, res) => {
    fs.readFile('views/RSGAbout.html', null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        else {
            const document = new JSDOM(data).window.document
            res.send(document.documentElement.outerHTML)
        }
    })

});

app.get('/articles', (req, res) => {

    fs.readFile('views/RSGArticles.html', null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        else {
            const document = new JSDOM(data).window.document
            var insertDiv = document.getElementById("insert-articles")
            var requests = document.getElementById("request-forms")
            fs.readFile('public/articles/articles.json', null, (error, dat) => {
                if (error) {
                    console.log(error)
                    return
                }
                else {
                    var jsonObj = JSON.parse(dat);
                    
                    for(var i = 0; i < jsonObj.requestForArticles.length; i++)
                    {
                        var path = `\\documents\\${jsonObj.requestForArticles[i].filename}`
                        console.log(path)
                        requests.innerHTML += `
                        <div class="pdf-container" style="height: fit-content;">
                        <br />
                        <embed src="${path}" width=80% height="800px" style="display: block; margin: auto;" />
                        <br />
                    </div>
                    `
                    }

                    for (var i = 0; i < jsonObj.articles.length; i++) {
                        
                        insertDiv.innerHTML+= `
                        <div role="listitem" class="blog-preview-wrap w-dyn-item" style="margin: auto; align-content: center;">
                            <a href="${jsonObj.articles[i].url}" class="business-article-heading">${jsonObj.articles[i].name}</a>
                            <div class="label cc-blog-date">${jsonObj.articles[i].date}</div>
                            <p class="paragraph-light">${jsonObj.articles[i].synopsis}</p>
                        </div>`
                    }
                    res.send(document.documentElement.outerHTML)
                }
            }
            )
            
        }
    })

});


app.get('/events', (req, res) => {

    fs.readFile('views/RSGEvents.html', null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        else {
            const document = new JSDOM(data).window.document
            var insertDiv = document.getElementById("insert-events")
            fs.readFile('public/events/events.json', null, (error, dat) => {
                if (error) {
                    console.log(error)
                    return
                }
                else {
                    var jsonObj = JSON.parse(dat);
                    
                    for (var i = 0; i < jsonObj.events.length; i++) {
                        
                        insertDiv.innerHTML+= `
                         <div id="w-node-76c147234d34-e6de2bd7" onclick="window.location.href = '${jsonObj.events[i].url}';">
                            <div class="home-section-wrap">                                
                                <h2 class="section-heading">${jsonObj.events[i].name}</h2>
                                <div class="label cc-light">
                                    ${jsonObj.events[i].date}<br/>${jsonObj.events[i].host}
                                </div>
                                <p class="paragraph-light">${jsonObj.events[i].synopsis}</p>            
                            </div>
                        </div>`
                    }
                    res.send(document.documentElement.outerHTML)
                }
            }
            )
            
        }
    })

});


app.get('/board', (req, res) => {

    fs.readFile('views/RSGBoard.html', null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        else {
            const document = new JSDOM(data).window.document
            var insertDiv = document.getElementById("insert-board")
            fs.readFile('public/board/board.json', null, (error, dat) => {
                if (error) {
                    console.log(error)
                    return
                }
                else {
                    var jsonObj = JSON.parse(dat);
                    
                    for (var i = 0; i < jsonObj.board.length; i++) {
                        
                        insertDiv.innerHTML+= `
                         <div id="w-node-76c147234d34-e6de2bd7" style="width: 50%;" >
                            <div class="home-section-wrap" style="margin: auto;">                                
                                <img style="margin:auto;" src="${jsonObj.board[i].image}" id="w-node-76c147234d3f-e6de2bd7" alt=""/>
                                <h2 style="text-align: center;" class="section-heading">${jsonObj.board[i].name}</h2>
                                <p style="text-align: center;" class="paragraph-light">${jsonObj.board[i].role}</p>            
                            </div>
                        </div>`
                    }
                    res.send(document.documentElement.outerHTML)
                }
            }
            )
            
        }
    })

});


app.get('/', (req, res) => {

    fs.readFile('views/RSGHome.html', null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        else {
            const document = new JSDOM(data).window.document
            var insertDiv = document.getElementById("insert-articles")
            fs.readFile('public/articles/articles.json', null, (error, dat) => {
                if (error) {
                    console.log(error)
                    return
                }
                else {
                    var jsonObj = JSON.parse(dat);
                    const max = 3
                    if(jsonObj.articles.length < 3)
                        max = jsonObj.articles.length
                    for (var i = 0; i < max; i++) {
                        
                        insertDiv.innerHTML+= `
                        <div role="listitem" class="blog-preview-wrap w-dyn-item" style="margin: auto; align-content: center;">
                            <a href="${jsonObj.articles[i].url}" class="business-article-heading">${jsonObj.articles[i].name}</a>
                            <div class="label cc-blog-date">${jsonObj.articles[i].date}</div>
                            <p class="paragraph-light">${jsonObj.articles[i].synopsis}</p>
                        </div>`
                    }
                    res.send(document.documentElement.outerHTML)
                }
            }
            )            
        }
    })

});


app.listen(port, function () {
    console.log(`Server running on port: ${port} \nhttp://127.0.0.1:${port}/`)
})