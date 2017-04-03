#! /usr/bin/python

"""Convert FrameTrail annotations to WebAnnotation data model.

This code is licensed under the same terms as the FrameTrails software.

Copyright (c) 2017 Olivier Aubert <contact@olivieraubert.net>
"""

import datetime
import json
import sys
import time
from collections import OrderedDict

# Define a mapping between FrameTrail type and WebAnnotation general
# content types
bodytype_mapping = {
    'image': 'Image',
    'webpage': 'Text',
    'wikipedia': 'Text',
    'youtube': 'Video',
    'video': 'Video',
    'vimeo': 'Video',
}
def generate_body(a, basename):
    """Generate the body for a given frametrail annotation.
    """
    if a['type'] == 'text':
        res = OrderedDict((
            ("type", 'Text'),
            ("value", a["text"]),
            ("format", "text/plain"),
            ("frametrail,name", a['name']),
            ("frametrail,thumb", a['thumb']),
        ))
        return res
    elif a['type'] in bodytype_mapping:
        res = OrderedDict((
            ("type", bodytype_mapping[a['type']]),
            ("id", a["src"]),
            ("frametrail:name", a['name']),
            ("frametrail:thumb", a['thumb']),
        ))
        at = a['attributes']
        if 'alternateVideoFile' in at:
            res['frametrail:alternateSrc'] = at['alternateVideoFile']
        if 'autoPlay' in at:
            res['frametrail:autoplay'] = at['autoPlay']
        return res
    elif a['type'] == 'location':
        return OrderedDict((
            # Custom format
            ("type", "frametrail,Location"),
            ("format", "application/x-frametrail-location"),
            ("frametrail,name", a['name']),
            # This can be discussed. I chose to keep lat/long as
            # separate properties (because such properties exist in
            # the wgs84 ontology), but serialize the boundingBox
            # information, since the closest equivalent is the
            # MediaFragment box specification.
            # frametrail,lat/lon should be defined as
            # equivalent to
            # http,//www.w3.org/2003/01/geo/wgs84_pos#lat/long
            ("frametrail,lat", a['attributes']['lat']),
            ("frametrail,long", a['attributes']['lon']),
            ("frametrail,boundingBox", ",".join(a['attributes']['boundingBox']))
        ))

def convert_annotation(a, video_url):
    t = time.localtime(a["created"] / 1000)
    dt = datetime.datetime(*t[:-2])
    return OrderedDict((
        ("@context", [ "http://www.w3.org/ns/anno.jsonld",
                      { "frametrail": "http://frametrail.org/ns/" }
        ]),
        ("id", a['resourceId']),
        ("creator", {
            "id": a["creatorId"],
            "type": "Person",
            "nick": a["creator"]
        }),
        ("created", dt.isoformat()),
        ("type", "Annotation"),
        ("target", OrderedDict((
            ("type", "Video"),
            ("source", video_url),
            ("selector", {
                "type": "FragmentSelector",
                "conformsTo": "http://www.w3.org/TR/media-frags/",
                "value": "t=%s,%s" % (a['start'], a['end'])
            })
        ))),
        ("body", generate_body(a))
    ))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: %s input.js [output.json]" % sys.argv[0])
        sys.exit(1)
    source = sys.argv[1]
    with open(source, 'r') as f:
        data = json.load(f)
    webannotation = [ convert_annotation(a, "http://specify.me/video_url.mp4") for a in data ]
    if len(sys.argv) > 2:
        out = open(sys.argv[2], 'w')
    else:
        out = sys.stdout
    json.dump(webannotation, out, indent=2)

