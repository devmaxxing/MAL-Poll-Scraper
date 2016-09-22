import scrapy
from malpollscraper.items import MalpollscraperItem

class MalSpider(scrapy.Spider):
    name = "malSpider"
    animeId = 0
    showNum = 0

    def __init__(self, id):
        self.animeId = id
        self.start_urls = ["http://myanimelist.net/forum/?animeid=" + str(id) + "&topic=episode"]
        

    def parse(self, response):
        
        discussionsExist = False
        for discussionURL in response.xpath('//table[@id="forumTopics"]//a[contains(.,"Discussion")]/@href').extract():
            discussionsExist = True
            yield scrapy.Request(response.urljoin(discussionURL + "&pollresults=1"), callback=self.parse2)            

        if discussionsExist: #parse next discussion page
            self.showNum += 50
            yield scrapy.Request("http://myanimelist.net/forum/?animeid=" + str(self.animeId) + "&topic=episode&show=" + str(self.showNum))


    def parse2(self, response):
        item = MalpollscraperItem()

        title = response.xpath('//title[1]/text()').extract_first()
        item['anime'] = title[1:title.find(' Episode')]
        title = title[title.find('Episode ') + 8:]
        item['episodeNumber'] = int(title[:title.index(' ')])

        index = 0
        item['ratings'] = [0,0,0,0,0]
        item['numVotes'] = 0
        item['mean'] = 0

        for numVotes in response.xpath('//table[1]/tr/td[3]/text()').extract():
            item['ratings'][index] = int(numVotes)
            item['mean'] += (5-index)*int(numVotes)
            item['numVotes'] += int(numVotes)
            index += 1
        item['mean'] /= float(item['numVotes'])

        yield item