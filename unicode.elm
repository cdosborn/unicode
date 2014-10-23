module Unicode where

import Graphics.Input.Field (..)
import Graphics.Input (..)
import Keyboard (..)

inputCodePoint : Input Content
inputCodePoint = input noContent

leftOrRightArrows = .x <~ arrows
contentString = .string <~ inputCodePoint.signal
--content =  filterContent <~ (add <~ contentString ~ leftOrRightArrows) ~ inputCodePoint.signal
content = (\int -> { noContent | string <- show int } ) <~ (foldp (+) 0 leftOrRightArrows)
--codePointField = field defaultStyle inputCodePoint.handle id "0" <~ content 
codePointField = field defaultStyle inputCodePoint.handle id "" <~ inputCodePoint.signal

filterContent str record = { record | string <- str }

add str x =
    case String.toInt str of 
        Just n -> show (n + x)
        Nothing -> str

type CodePoint = String --None | Dec String | Hex String | Bin String

type Numeral = { hex : String, bin: String }

type Encoding = { ascii : { hex : String, bin: String }
                , utf8  : { hex : String, bin: String }
                , utf16 : { hex : String, bin: String }
                , utf32 : { hex : String, bin: String }
                , glyph : String }
                    
port messageIn : Signal { ascii : { hex : String, bin : String }
                        , utf8  : { hex : String, bin : String }
                        , utf16 : { hex : String, bin : String }
                        , utf32 : { hex : String, bin : String }
                        , glyph : String }


port messageOut : Signal String
--port messageOut = .string <~ content
port messageOut = .string <~ inputCodePoint.signal

render f json = flow down [f, asText json]

main = render <~ codePointField ~ messageIn

--main = asText <~ messageIn
--main = codePointField
