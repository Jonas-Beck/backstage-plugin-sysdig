import React from 'react';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { Gauge } from '@backstage/core-components';

const interleave = (arr: any, thing: any) => [].concat(...arr.map((n: any) => [n, thing])).slice(0, -1)

const getStatusColorSpan = (status: string) => {
  var hStyle;
  if (status === 'failed' || status === 'false') {
    hStyle = { color: 'red' };
  } else if (status === 'passed' || status === 'true') {
    hStyle = { color: 'green' };
  } else {
    hStyle = { color: 'gray' };
  }
  return <span style={ hStyle }>{status}</span>
};

function getChips(severities: any) {
  if (!severities) { return <span><Chip label="None" style={{backgroundColor:'gray'}}></Chip></span>}
  return <span>
    <Chip label={severities["critical"] + " Critical"} style={{backgroundColor:'violet'}}></Chip>
    <Chip label={severities["high"] + " High"} style={{backgroundColor:'red'}}></Chip>
    <Chip label={severities["medium"] + " Medium"} style={{backgroundColor:'orange'}}></Chip>
    <Chip label={severities["low"] + " Low"} style={{backgroundColor:'yellow'}}></Chip>
    <Chip label={severities["negligible"] + " Info"} style={{backgroundColor:'gray'}}></Chip>
  </span>;
}

function getScope(scope: any) {
  var textScope = []
  for (var key in scope) {
    textScope.push(<p><b>{key}</b>{': '}{scope[key]}<br/></p>);
  }
  return textScope;
}

function getDetails(scan: any) {
  return <Tooltip title={<div>
      <Typography color="inherit">Result Details</Typography>
      {(() => {
        let details : any = [];
        if ("scope" in scan) details = getScope(scan.scope)
        console.log(getScope(scan.scope))
        //if ("configuration" in scan) details.concat(getScope(scan.configuration))
        if ("labels" in scan) details.push(
          <div><br/><b>Labels</b>:<br/> {interleave(scan.labels,<br/>)}</div>
        )
        if ("zones" in scan) details.push(
          <div><br/><b>Zones</b>:<br/> {interleave(scan.zones.map( (item: { name: any; }) => { return item.name }),<br/>)}</div>
        )
        return details
      })()}</div>
  }>
    <IconButton aria-label="delete">
      <InfoIcon />
    </IconButton>
  </Tooltip>;
}

function truncate(str: string, n: number){
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

function getFailed(failed: any) {
  let result = []
  for (const policy of failed.filter((f: { [x: string]: any; }) => {return !f["pass"]})) {
    result.push(<Chip size="small" label={truncate(policy["name"],25)} style={{backgroundColor:'red'}}></Chip>)
  }
  return result;
}

function getPassed(passed: any) {
  let result = []
  for (const policy of passed.filter((f: { [x: string]: any; }) => {return f["pass"]})) {
    result.push(<Chip size="small" label={truncate(policy["name"],25)} style={{backgroundColor:'green'}}></Chip>)
  }
  return result;
}

function getGauge(passPercentage: number) {
  return <div style={{width:200}}><Gauge
        value={passPercentage/100}
      /></div>;
}

function getResourceName(name: string, type: string, platform: string, origin: string) {
  return <div>
    <h2>{name}</h2>
    <Chip size="small" label={<p><b>Resource Type = </b>{type}</p>}></Chip>
    <Chip size="small" label={<p><b>Platform = </b>{platform}</p>}></Chip>
    <Chip size="small" label={<p><b>Origin = </b>{origin}</p>}></Chip>
  </div>
}

// Convert from timestamp to datetime
function getDate(timestamp: number): string {
  const date = new Date(timestamp);
  // render date as sortable string alphabetically
  const split_strings = date.toISOString().split('T');
  const ymd = split_strings[0];
  const time = split_strings[1].split('.')[0];
  return ymd + " " + time;
}


// convert url to an a href
const getUrl = (url: string) => {
  if (url) {
    var hStyle = { color: 'blue' };
    return <a href={url} target="_blank" style={ hStyle }>Link to Scan Result</a>
  }
  return null;
};

// URL encode a string
const urlEncode = (str: string) => {
  return encodeURIComponent(str);
};

export {
  getStatusColorSpan,
  getChips,
  getDetails,
  getDate,
  getUrl,
  getGauge,
  getScope,
  getFailed,
  getPassed,
  getResourceName,
  urlEncode
};