from .. import get_cache
# cache = get_cache()
import json
from ..models import Theatre, TheatreShow
from ..models import Show as ModelShow
# from . import get_app
# app = get_app()
# @cache.cached(timeout = 50, key_prefix='get_all_show')
def get_all_show():
    
    reqList=[]
    try:
        allvenue=Theatre.query.all()
        for a in allvenue:
            allLinkedtheatreshow=TheatreShow.query.filter_by(theatre_id=a.id).all()
            venlist=[]
            venlist.append(a.to_dict())   
            for b in allLinkedtheatreshow:
                allLinkedShow=ModelShow.query.filter_by(id=b.show_id).all()
                for c in allLinkedShow:
                    print(allLinkedShow)
                    venlist.append(c.to_dict())
            reqList.append(venlist)
        print(reqList)
        return json.dumps({'data':reqList}), 200
    except:
        return json.dumps({'data':'Some Error occured'}), 500
