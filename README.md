# mediathread-collect

[![Greenkeeper badge](https://badges.greenkeeper.io/ccnmtl/mediathread-collect.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/ccnmtl/mediathread-collect.svg?branch=master)](https://travis-ci.org/ccnmtl/mediathread-collect)

Common code for the Chrome, Safari, and Firefox extensions for Mediathread.

ARCHITECTURE:
Everything lives within two namespaces: window.MediathreadCollect and
window.MediathreadCollectOptions.

MediathreadCollectOptions is a dictionary which can (and must to work
as a extension) be created before this file is loaded.  This
way, if required, this file could also be used as a library.  In
this scenario, if a site wanted an 'AnalyzeThis' button to work
without a user needing to install a extension, then this file
would be loaded, and the button would call into
`MediathreadCollect.runners['jump']` (or .decorate).

A typical MediathreadCollectOptions set of values would be:

    {
        'action': 'jump',
        'host_url': 'http://mediathread.example.com/save/?',
        'flickr_apikey': 'foobar123456789'
    }

The 'action' mostly services the extension, but in theory, this
separates the initialization code along with what the
extension's action would be -- to immediately jump into
mediathread or to display the options list (which is more often
the default).

Basic parts:
`.hosthandler.*` : This dictionary is a list of all special-cased
hosts.  When these keys match anywhere (so
university proxies will work) in
document.location, then this code will be
preferred rather than searching over the normal
media types.  This should be a method of last
resort -- supporting generic media-types is much
better, but this can be especially useful when
looking for metadata.

find: function(callback) = this is the function, which fill find assets and
then run callback([array of assets -- see below for datastructure])
-- async allows you to make ajax calls, or whatever else you need

`allow_save_all` = if true, there will be an interface on the
bottom to save all assets at once.  This is
somewhat experimental -- used to load a
whole course from VITAL into MediaThread

`also_find_general` = if true, then the normal media type
queries will be run.  This is a good way
to implement custom metadata searches,
without rewriting support for media.
Also, see the youtube.com example for a
way to call into the general media types
to search for a particular kind of media,
without duplicating code.


.assethandler.* : This is where all the methods are that look for
media or metadata on the page.  Each key:value
is run with the extension for a chance to
find its kind of assets, and, if found, query
for more data.

Besides finding media, an assethandler can also find metadata,
and if the metadata can only be pinned to 'something on the page'
then you should set 'page_resource': true in the assethandler dict.

Each .find method is called as
find.apply(assethandler,callback,{window: window,document: document})

note: use the context passed into the method
rather than global window/document
objects, since the extension
supports deeply embedded
frames/iframes and the context might
be different The .find method is
responsible for eventually calling
callback([array of assets]) with a
blank array if none are found.


The asset objects passed back should have the following structure:

    {html:<dom object of media>,
    primary_type:<string of the sources key
    most important for this media.  e.g. 'video' >,
    sources: {
    title:<title string.  if omitted, it will
    be discerned from the primary_type's filename>,

    url: <only use if you want to
    override the url that is
    displayed to the user as a
    link to get back to the
    archive's page for the
    asset.  mostly this is just
    document.location>

    <key:values of urls that will be
    stored in the asset's Source
    objects in MediaThread>

    <key>-metadata: <metadata for the source
    key in the form of 'w<width>h<height>' >
    },

    metadata: { <key, value pairs for metadata.
    Values should always be an array of strings>
    }

    }

`.assethandler.objects_and_embeds.*`
Since a large subset of assethandlers look for an
object or embed tag, and dancing between duplicate
versions often appear in sites, the general code is
handled as a big assethandler with sub-handlers for checking object
and embed tags.  It's important to look at examples for good
practices on how to go through these elements.  These have two main
functions:

`.match(embed_or_object)` = this function should `===null` if the embed/object
tag does not match, and can return anything else, if it does match.
`.asset(embed_or_object,matchRv,context,index,optionalCallback)`
`@matchRv` = whatever .match returned
`@optionalCallback` = you can just return the `asset_object` directly
but if you need to do ajax, or callback-based apis to get all the
info/metadata, then you can return an asset object with with a
'wait': true key, and then call
optionalCallback(@index, asset_object) where @index is the
index argument passed to .asset.


runners : as described above, runners are alternate 'setups' that mediathread
can be run in.
'jump' generally means if one asset is found on the page jump right into
mediathread
'decorate' means bring up the MediathreadCollect.Interface and let the user
take another
action.  This is probably the best one going forward.

HELP FUNCTIONS:
connect: quick cross-browser event-listener
hasClass(elem,cls),
hasBody(doc) -- does it have a doc.body value?  `<frameset>` pages do NOT
clean(str), getImageDimensions(), mergeMetadata(),
xml2dom(str,xhr), absoluteUrl(),
elt() for creating new html in a way that is frame/browser friendly

Finder() : This object is the main thing that walks through the document's
media through
any sub-frames and merges the results into a list.

Interface() : This is the object that creates and manages the extension
interface
(The gray widget that appears, listing the assets, and presenting the
analyze buttons, etc.)

This interface calls Finder() and displays the results

FOOTER:
At the bottom of this file is the init/bootstrap code which runs the right
part of
MediathreadCollect.* (generally a runner) after inspecting
MediathreadCollectOptions
