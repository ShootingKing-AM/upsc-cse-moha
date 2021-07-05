import * as betterKV from './betterKV';

let topMessageIDArray = ['850808004298145802', '852954136155914321'];

let loginfoChannelID = '850411914815471639';
let topMessageChannelID = loginfoChannelID; // Same as Log-Info Channel

let channelId = '780116866484011040'; // Channel to send Normal bot(non-log) response messages & To receive bot userCmds
let channelIdToWatch = '813261332630863882'; // Voice Channel to Watch

let defaultPrefix = '$';

let ALLTIME_DATA_INDEX = 0;
let TODAY_DATA_INDEX = 1;

// UPSC Roles
let arrHoursLevels = [
  [0.5, '857501958634209280'], //Spark;
  [6, '857501768194981918'], //Beginner;
  [12, '857502270535368725'], //Learner;
  [48, '857502562956738560'], //Ambitious;
  [100, '857502927634432041'], //Momentous;
  [160, '857503167982075924'], //Studious ;
  [200, '857503357304045568'], //A+ Student
  [250, '857503593296298015'], //Scholar
  [300, '857504034969747456'], //Guru
  [350, '857504345644990474'], //Study Master
  [420, '857505019985395732'] //Study Lord
];

// SK Test Server roles
/*let arrHoursLevels = [
  [0.5, '857696219971059723'], //Spark -- Level 1;
  [6, '857696370197659688'], //Beginner -- Level 2;
  [12, '857696421158584340'] //Learner -- Level 3;
];*/

/*
 *  Character - !
 *  User Commands:
 *  info - Shows how much time you spent
 *  info @friend - Show how much time your friend has spent
 *  lb - Shows the leaderboard
 *  clear - clears your total time spent on studying
 *  ping - Pings the bot - Usually to check if its Online or Down
 *
 *  Admin Commands:
 *  setthrs @user <time> - eg. setthrs @sk 10.0 - Overwrites TotalTime Spent by user to <time>
 *  setstorage - will make the bot send a EmptyJSON for new LeaderBoard @warn You may lose exiting leaderboard
 *  runcron - forcefully run 3.00 AM CronTask, making dailytimes Reset & taking autobackup of db
 *  runabackup - forcefully run only autobackup of db  (normally run with cron task @ 3.00 AM)
 *  testlvl <hrs> - Run levels algorithm on you and assign you a level role wrt hrs passed.
 *  cleardbentry <dbKey> - Will delete the database Entry identified by dbKey
 *  loaddb <DBJson> - will add/updates all DBJson values into database
 */

// Here's an example of how to use the built in command handler.
const userCommands = new discord.command.CommandGroup({
  filters: discord.command.filters.or(
    discord.command.filters.isChannelId(channelId),
    discord.command.filters.isChannelId(loginfoChannelID)
  ),
  defaultPrefix: defaultPrefix // You can customize your default prefix here.
});

const adminCommands = new discord.command.CommandGroup({
  filters: discord.command.filters.and(
    discord.command.filters.isChannelId(loginfoChannelID),
    discord.command.filters.isAdministrator()
  ),
  defaultPrefix: defaultPrefix // You can customize your default prefix here.
});

const modsCommands = new discord.command.CommandGroup({
  filters: discord.command.filters.and(
    discord.command.filters.isChannelId(loginfoChannelID)
  ),
  defaultPrefix: defaultPrefix // You can customize your default prefix here.
});

async function updateTopMessage(
  userID: string,
  userHrs: string,
  topMessageType: number
) {
  const channel = await discord.getGuildTextChannel(topMessageChannelID);
  const topMessage = await channel?.getMessage(
    topMessageIDArray[topMessageType]
  );

  //console.log('awaiting for Message ... got userHrs as ' + userHrs);
  /*let topMessage = await discord
    .getTextChannel(topMessageChannelID)
    .then((c) => c?.getMessage(topMessageID));*/
  //console.log('awaiting done parsing json  ...' + topMessage?.content);

  const jsonTop = JSON.parse(topMessage?.content!);
  /*const jsonTop = JSON.parse(
    '{"1":1980,"2":1981,"3":1982,"4":1983,"5":1984,"6":1985,"7":1986,"8":1987,"9":1988,"10":1989,"11":1990,"12":1991,"13":1992,"14":1993,"15":1994,"16":1995,"17":1996,"18":1997,"19":1998,"20":1999,"21":2000,"22":2001,"23":2002,"24":2003,"25":2004}'
  );*/
  //console.log('jsonTop will follow now ...');

  //console.log(jsonTop + '; Type of : ' + typeof jsonTop);

  let numObjects = 0;
  let found = false;
  for (let key in jsonTop) {
    //console.log(
    //  'index: ' + numObjects + 'key: ' + key + ', value: ',
    //  jsonTop[key]
    //);
    if (key == userID) {
      jsonTop[key] = userHrs;
      found = true;
    }
    numObjects++;
  }
  if (found == false) {
    jsonTop[userID] = parseFloat(userHrs);
    numObjects++;
  }

  var sortable = [];
  for (var key in jsonTop) {
    sortable.push([key, jsonTop[key]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  let totalEntries = numObjects;
  //jsonTop.sort();
  //console.log('Sorted will follow now ...');
  /*for (let key in sortable) {
    console.log(
      'index: ' +
        numObjects +
        ' key: ' +
        key +
        ', value: ' +
        sortable[key][0] +
        ', ' +
        sortable[key][1]
    );
  }*/

  let jsonString = '{';
  let i = 0;
  for (let key in sortable) {
    numObjects--;
    jsonString += '"' + sortable[key][0] + '":' + sortable[key][1];
    if (i < 19 && numObjects) jsonString += ',';
    else break;
    i++;
  }
  jsonString += '}';

  //console.log('JSON: ' + jsonString);
  topMessage?.edit(jsonString);

  /*if (numObjects < 1) {
    topMessage?.edit(`{"${userID + `":` + userHrs}}`);
    console.log(`{"${userID + `":` + userHrs}}`);
  }*/
}

async function getUserPosition(
  userID: string,
  topMessageType: number
): Promise<number> {
  const channel = await discord.getGuildTextChannel(topMessageChannelID);
  const topMessage = await channel?.getMessage(
    topMessageIDArray[topMessageType]
  );

  const jsonTop = JSON.parse(topMessage?.content!);

  let numObjects = 0;
  let found = false;
  for (let key in jsonTop) {
    if (key == userID) {
      found = true;
    }
    numObjects++;
  }
  if (found == false) {
    return -1;
  }

  var sortable = [];
  for (var key in jsonTop) {
    sortable.push([key, jsonTop[key]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  let totalEntries = numObjects;

  let i = 1;
  for (let key in sortable) {
    numObjects--;
    if (sortable[key][0] == userID) {
      return i;
    }
    i++;
  }
  return -1;
}

let rankEmojis = [
  ':first_place:',
  ':second_place:',
  ':third_place:',
  ':four:',
  ':five:',
  ':six:',
  ':seven:',
  ':eight:',
  ':nine:'
];

function getRankEmoji(rank: number): string {
  if (rank == -1) return '';

  if (rank < 4) {
    if (rank < 4) return rankEmojis[rank - 1];
    else return '(#' + rankEmojis[rank - 1] + ')';
  } else return '(#' + rank + ')';
}

async function showUserIDTotalTime(
  message: discord.Message,
  userObj: discord.User
) {
  let exits = await betterKV.exist(userObj.id, 'TotalTimes');
  if (exits) {
    let totalTime = (await betterKV.get<string>(userObj.id, 'TotalTimes'))!;
    if (totalTime.indexOf(',') == -1) {
      await message.reply(
        `\`${userObj.username}#${userObj.discriminator}\` has spent ` +
          totalTime +
          ` hrs`
      );
    } else {
      let timesArray = totalTime.split(',');
      /*await message.reply(
        `\`${userObj.username}#${userObj.discriminator}\` has spent All-time of \`` +
          timesArray[ALLTIME_DATA_INDEX] +
          ' hrs` and spent `' +
          timesArray[TODAY_DATA_INDEX] +
          ' hrs` today on studying.'
      );*/

      let online = await betterKV.exist(userObj.id, 'TempTimes');
      let szOnlineStatus = '**Current Session Status** : ';

      let alltimePosition = await getUserPosition(
        userObj.id,
        ALLTIME_DATA_INDEX
      );
      let todayPosition = await getUserPosition(userObj.id, TODAY_DATA_INDEX);

      //console.log(alltimePosition);
      //console.log(todayPosition);

      if (online) {
        szOnlineStatus +=
          ':green_circle: Online \n**Time in Current Session** :  ';
        let tsJoined = (await betterKV.get<string>(userObj.id, 'TempTimes'))!;
        szOnlineStatus +=
          '`' +
          (((Date.now() - parseInt(tsJoined)) / (1000 * 60)) as number).toFixed(
            2
          ) +
          '+` mins';
        szOnlineStatus += '\n\n';
      } else {
        szOnlineStatus += ':red_circle: Offline\n\n';
      }

      let guild = await discord.getGuild();
      let member = await guild.getMember(userObj.id);
      //console.log(member?.roles);

      await message.reply(
        new discord.Embed({
          title: ':chart_with_upwards_trend:  Personal Information',
          thumbnail: {
            url: userObj.getAvatarUrl()
          },
          color: ((1 << 24) * Math.random()) | 0,
          description:
            '**Username** : ' +
            `${userObj.username}#${userObj.discriminator}\n` +
            '**UserID** : `' +
            `${userObj.id}\`\n` +
            '**Joined** : ' +
            member!.joinedAt +
            '\n\n' +
            '**Today** : `' +
            timesArray[TODAY_DATA_INDEX] +
            '` hrs ' +
            (todayPosition > 0 ? getRankEmoji(todayPosition) : '') +
            '\n' +
            '**All Time** : `' +
            timesArray[ALLTIME_DATA_INDEX] +
            '` hrs  ' +
            (alltimePosition > 0 ? getRankEmoji(alltimePosition) : '') +
            '\n\n' +
            szOnlineStatus +
            '\n',
          footer: {
            iconUrl: guild.getIconUrl()!,
            text: 'Type `' + defaultPrefix + 'lb` to see the leaderboard'
          }
        })
      );
    }
  } else {
    await message.reply(
      `\`${userObj.username}#${userObj.discriminator}\` has not spent any time on Studying :(`
    );
  }
}

// info
userCommands.on(
  'info',
  (args) => ({
    user: args.userOptional()
  }),
  async (message, { user }) => {
    if (user != null) {
      await showUserIDTotalTime(message, user);
    } else {
      await showUserIDTotalTime(message, message.member.user);
    }
  }
);

userCommands.on(
  'lb',
  (args) => ({ what: args.stringOptional() }),
  async (message, { what }) => {
    let topMessageID = topMessageIDArray[TODAY_DATA_INDEX];
    let msg = '**LeaderBoard** (__Today__)\n\n';

    if (what != null) {
      topMessageID = topMessageIDArray[ALLTIME_DATA_INDEX];
      msg = '**LeaderBoard** (__AllTime__)\n\n';
    }

    //let topMessageChannelID = '850411914815471639';
    const channel = await discord.getGuildTextChannel(topMessageChannelID);
    const topMessage = await channel?.getMessage(topMessageID);
    const jsonTop = JSON.parse(topMessage?.content!);

    let i = 1;

    for (let key in jsonTop) {
      const u = await discord.getUser(key);
      msg +=
        i +
        '. ' +
        `\`${u?.username}#${u?.discriminator}\` (${jsonTop[key]} hrs)\n`;
      i++;
    }

    if (what == null)
      msg += `\nUse \`${defaultPrefix}lb alltime\` - for *All-time Leaderboard*`;
    else msg += `\nUse \`${defaultPrefix}lb\` - for *Today's Leaderboard*`;

    if (i > 1) await message.reply(msg);
    else {
      if (what == null) {
        await message.reply(
          "Today's Leaderboard is empty, Be the first one to start studing and get on it !! :)" +
            `\n\nUse \`${defaultPrefix}lb alltime\` - for *All-time Leaderboard*`
        );
      } else {
        await message.reply(
          "Alltime's Leaderboard is empty, Be the first one to start studing and get on it !! :)" +
            `\n\nUse \`${defaultPrefix}lb\` - for *Today's Leaderboard*`
        );
      }
    }
  }
);

userCommands.raw('clear', async (message) => {
  // Respond to the message, pinging the author.
  let exits = await betterKV.exist(message.member.user.id, 'TotalTimes');
  if (exits) {
    let totalTime = await betterKV.get(message.member.user.id, 'TotalTimes');
    await message.reply(
      `\`${message.member.user.username}#${message.member.user.discriminator}\` has spent ` +
        totalTime +
        ` hrs`
    );
    betterKV.del(message.member.user.id, 'TotalTimes');
    await message.reply(
      `\`${message.member.user.username}#${message.member.user.discriminator}\` cleared his data`
    );
  } else {
    await message.reply(
      `\`${message.member.user.username}#${message.member.user.discriminator}\` cleared his inexistent data :O`
    );
  }
});

// A simple command, !ping -> Pong!
userCommands.raw('ping', async (message) => {
  message.reply('Hi Nub !');
  console.log('Ping Called');
});

async function setTotalHrs(
  time: number,
  todaytime: number,
  message: discord.Message,
  userObj: discord.User
) {
  let exits = await betterKV.exist(userObj.id, 'TotalTimes');

  if (exits) {
    let origTime = (await betterKV.get<string>(userObj.id, 'TotalTimes'))!;
    if (origTime.indexOf(',') != -1) {
      //New DataScheme {altime, today}
      let origTimeArray = origTime.split(',');

      await message.reply(
        `\`${userObj.username}#${userObj.discriminator}\`'s Total time has been modified from \`` +
          origTimeArray[ALLTIME_DATA_INDEX] +
          ':' +
          origTimeArray[TODAY_DATA_INDEX] +
          '` to `' +
          time.toFixed(2) +
          ':' +
          todaytime.toFixed(2) +
          `\` hrs by ${message.member?.user.toMention()}`
      );
      await betterKV.save(
        userObj.id,
        time.toFixed(2) + ',' + todaytime.toFixed(2),
        'TotalTimes'
      );
      updateTopMessage(userObj.id, time.toFixed(2), ALLTIME_DATA_INDEX);
      updateTopMessage(userObj.id, todaytime.toFixed(2), TODAY_DATA_INDEX);
    } else {
      //Old DataScheme 'altime', Convert

      await message.reply(
        `\`${userObj.username}#${userObj.discriminator}\`'s Total time has been modified from \`` +
          origTime +
          '` to `' +
          time.toFixed(2) +
          ':' +
          todaytime.toFixed(2) +
          `\` hrs by ${message.member?.user.toMention()}`
      );

      await betterKV.save(
        userObj.id,
        time.toFixed(2) + ',' + todaytime.toFixed(2),
        'TotalTimes'
      );
      updateTopMessage(userObj.id, time.toFixed(2), ALLTIME_DATA_INDEX);
      updateTopMessage(userObj.id, todaytime.toFixed(2), TODAY_DATA_INDEX);
    }
  } else {
    await message.reply(
      `\`${userObj.username}#${userObj.discriminator}\`'s Total time has been modified from \`null\` to ` +
        time.toFixed(2) +
        '(oldDataScheme) to' +
        todaytime.toFixed(2) +
        ` hrs by ${message.member?.user.toMention()}`
    );
    await betterKV.save(
      userObj.id,
      time.toFixed(2) + ',' + todaytime.toFixed(2),
      'TotalTimes'
    );
    updateTopMessage(userObj.id, time.toFixed(2), ALLTIME_DATA_INDEX);
    updateTopMessage(userObj.id, todaytime.toFixed(2), TODAY_DATA_INDEX);
  }
}

// setthrs
adminCommands.on(
  'setthrs',
  (args) => ({
    user: args.user(),
    allTime: args.number(),
    todayTime: args.number()
  }),
  async (message, { user, allTime, todayTime }) => {
    if (message.member.user.id != '317716017931485195') return;

    if (user != null) {
      await setTotalHrs(allTime, todayTime, message, user);
    } else {
      await setTotalHrs(allTime, todayTime, message, message.member.user);
    }
  }
);

adminCommands.raw('runcron', async (message) => {
  await cron_task();
});

async function sendTopPicToChannel(
  replyChannel: discord.GuildTextChannel,
  loginfoChannel: discord.GuildTextChannel,
  what: number
) {
  replyChannel.triggerTypingIndicator();
  let topMessageID = topMessageIDArray[what];
  //let msg = '**LeaderBoard** (__Today__)\n\n';

  /*if (what != null) {
      topMessageID = topMessageIDArray[ALLTIME_DATA_INDEX];
      msg = '**LeaderBoard** (__AllTime__)\n\n';
    }*/

  const channel = await discord.getGuildTextChannel(topMessageChannelID);
  const topMessage = await channel?.getMessage(topMessageID);
  const jsonTop = JSON.parse(topMessage?.content!);

  let i = 0;
  let top = [];
  for (let key in jsonTop) {
    const u = await discord.getUser(key);
    /*msg +=
        i +
        '. ' +
        `\`${u?.username}#${u?.discriminator}\` (${jsonTop[key]} hrs)\n`;*/
    top[i] = {
      value: jsonTop[key],
      tag:
        u?.getTag() ||
        'unknown#0000' /*,
            level: xpToLevel(entry.value as number),
            next: levelToXp(xpToLevel(entry.value as number) + 1),
            prev: levelToXp(xpToLevel(entry.value as number) - 1),
            avatar:
              user?.getAvatarUrl() ||
              'https://cdn.discordapp.com/embed/avatars/1.png'*/
    };
    i++;
    if (i > 9) break;
  }

  //const items = await xpKV.items();

  /*let top = await Promise.all(
      jsonTop.map((entry) =>
        discord.getUser(entry.key).then((user) => ({
          value: jsonTop[entry.key],
          tag:
            user?.getTag() ||
            'unknown#0000' ,
            level: xpToLevel(entry.value as number),
            next: levelToXp(xpToLevel(entry.value as number) + 1),
            prev: levelToXp(xpToLevel(entry.value as number) - 1),
            avatar:
              user?.getAvatarUrl() ||
              'https://cdn.discordapp.com/embed/avatars/1.png'
        }))
      )
    );*/

  const code = `
top = JSON.parse(top);

const imgSizeX = 1024, imgSizeY = 768;
const fontSize = 36, fontHeight = 60, lfontSize = 44;
const fontOffSetXCent = 0.06, fOffsetYCent = 0.15, lfOffsetYCent = 0.05;
const fillHXCent = 0.12,  fillHYCent = 1;
const fillOffsetXCent = 0, fillOffsetYCent = 0;
var testStr = ". mew#6969 (50 hrs)"

let eimage = (await Image.decode(await fetch('https://cdn.discordapp.com/attachments/823944652850987012/859053620862648370/Untitled-1512x368.png').then(r => r.arrayBuffer()))).resize(imgSizeX, imgSizeY);
const font = await fetch('https://cdn.discordapp.com/attachments/823944652850987012/859033002717478922/times.ttf').then(r => r.arrayBuffer()).then(b => new Uint8Array(b));
Ttag = await Image.renderText(font, lfontSize, "Leaderboard - Top10", 0xfae366ff)

const tImg = new Image(imgSizeX, imgSizeY);
let mTWidth = Ttag.width;
for(let index = 0; index < top.length; index++)
{
const user = top[index];
tag = await Image.renderText(font, fontSize, index+1+". " + user.tag + " ("+user.value+" hrs)", 0xfae366ff);
if(tag.width > mTWidth) mTWidth = tag.width;
tImg.composite(tag,0,index*fontHeight);
}

return eimage.composite(new Image(mTWidth+fillHXCent*imgSizeX, fillHYCent*imgSizeY).fill(0x000000AA), fillOffsetXCent*imgSizeX, fillOffsetYCent*imgSizeY)
.composite(Ttag, fontOffSetXCent*imgSizeX, lfOffsetYCent*imgSizeY)
.composite(tImg, fontOffSetXCent*imgSizeX, fOffsetYCent*imgSizeY)
.encode();`;

  //console.log(JSON.stringify(top));
  const request = await fetch('https://api.pxlapi.dev/imagescript/1.2.5', {
    body: JSON.stringify({
      code,
      inject: {
        //seed: randomBetween(10, 50),
        top: JSON.stringify(top)
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Application 5f7a2a7297aadf69252889f6dc52da84`
    },
    method: 'POST'
  });

  //let log = '';
  if (!request.ok)
    return loginfoChannel.sendMessage(
      `:x: Something went wrong generating the top msg:\n${await request.text()}`
    );

  return replyChannel.sendMessage({
    attachments: [
      {
        name: 'top.png',
        data: await request.arrayBuffer()
      }
    ]
  });

  /*new discord.Embed({
      title: 'title ~~(did you know you can have markdown here too?)~~',
      description: 'this is a test',
      url: 'https://discordapp.com',
      color: 4727036,
      timestamp: '2021-06-28T11:45:39.962Z',
      footer: {
        iconUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
        text: 'footer text'
      },
      image: {
        url:
          'https://cdn.discordapp.com/attachments/834808297931538533/859036062373773322/ImageScript.png'
      }
    })*/
}

modsCommands.on(
  'testpic',
  () => ({}),
  async (message) => {
    const channel = await message.getChannel();
    await sendTopPicToChannel(
      channel as discord.GuildTextChannel,
      channel as discord.GuildTextChannel,
      ALLTIME_DATA_INDEX
    );
  }
);

adminCommands.raw('runabackup', async (message) => {
  await autoBackup_force();
});
adminCommands.on(
  'cleardbentry',
  (args) => ({
    key: args.text()
  }),
  async (message, { key }) => {
    let exits = await betterKV.exist(key, 'TotalTimes');
    if (exits) {
      let totalTime = await betterKV.get(key, 'TotalTimes');
      await betterKV.del(key, 'TotalTimes');
      await message.reply(`\`${key}\`=\`${totalTime}\` cleared`);
    } else {
      await message.reply(`\`${key}\` does not exist`);
    }
  }
);

adminCommands.on(
  'loadbackup',
  (args) => ({
    json: args.text()
  }),
  async (message, { json }) => {
    const data = JSON.parse(json);
    //console.log(data);
    //console.log(json);
    if (data == null /*|| data.length < 1*/) {
      return message.reply('No data Supplied or Data is null; Data = ' + data);
    }

    for (let key in data) {
      //console.log(key + ' : ' + data[key] + ' saved.');
      await betterKV.save(key, data[key], 'TotalTimes');
    }
    return message.reply('Data added.');
  }
);

// A simple command, !ping -> Pong!
adminCommands.raw('setstorage', async (message) => {
  message.reply('{}');
});

discord.on('VOICE_STATE_UPDATE', async (newState, oldState) => {
  /*
  console.log('Called');
  let channel = await discord.getGuildTextChannel('848836989700407316');
  channel?.sendMessage(
    `<@${newState.member.user.id}> has interacted with a VoiceChannel !!`
  );*/

  if (
    oldState.channelId == newState.channelId &&
    oldState.selfVideo == newState.selfVideo &&
    oldState.selfStream == newState.selfStream
  )
    return;

  let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
  let memberinfochannel = await discord.getGuildTextChannel(channelId);

  if (oldState.channelId != null) {
    if (
      oldState.channelId === channelIdToWatch &&
      ((oldState.selfVideo == true &&
        oldState.selfStream == false &&
        newState.selfStream == false) || // Camm off
        (oldState.selfStream == true &&
          oldState.selfVideo == false &&
          newState.selfVideo == false)) // Stream off
    ) {
      let tsJoined = (await betterKV.get<string>(
        newState.member.user.id,
        'TempTimes'
      ))!;
      //console.log(tsJoined);
      await betterKV.del(newState.member.user.id, 'TempTimes');

      let sztsTimeSessionSpent = (((Date.now() - parseInt(tsJoined)) /
        (1000 * 60 * 60)) as number).toFixed(2);

      if (isNaN(parseFloat(sztsTimeSessionSpent))) {
        await loginfochannel?.sendMessage(
          `**Error** Occred in Saving: \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear: @ ` + //has left the voice channel
            Date.now() +
            ',\ntsJoined:' +
            tsJoined +
            ',\nsztsTimeSessionSpent:' +
            sztsTimeSessionSpent
        );
        await memberinfochannel?.sendMessage(
          `**Error** Occred in Saving: \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear:. Please contact Mods.` //has left the voice channel
        );
        return;
      }

      // TotalTimes Namespace- Saves Complete times
      let exits = await betterKV.exist(newState.member.user.id, 'TotalTimes');
      if (exits) {
        // Old time exits; Not a new user
        let hrsOld = (await betterKV.get<string>(
          newState.member.user.id,
          'TotalTimes'
        ))!;

        if (hrsOld.indexOf(',') != -1) {
          //New DataScheme {alltime,today}
          let hrsOldArray = hrsOld.split(',');

          if (
            isNaN(parseFloat(hrsOldArray[ALLTIME_DATA_INDEX])) ||
            isNaN(parseFloat(hrsOldArray[TODAY_DATA_INDEX]))
          ) {
            await loginfochannel?.sendMessage(
              `**Error** Occred in Saving (hrsOld[]): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear: @ ` + //has left the voice channel
                Date.now() +
                ',\nsztsTimeSessionSpent:' +
                sztsTimeSessionSpent +
                ',\ntsJoined:' +
                tsJoined +
                ',\nhrsOldArray[ALLTIME_DATA_INDEX]:' +
                hrsOldArray[ALLTIME_DATA_INDEX] +
                ',\nhrsOldArray[TODAY_DATA_INDEX]:' +
                hrsOldArray[TODAY_DATA_INDEX]
            );

            await memberinfochannel?.sendMessage(
              `**Error** Occred in Saving (hrsOld[]): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear: Please contact Mods.` //has left the voice channel
            );
            return;
          }

          let totalAllTime = (
            parseFloat(hrsOldArray[ALLTIME_DATA_INDEX]) +
            parseFloat(sztsTimeSessionSpent)
          ).toFixed(2);

          let totalTodayTime = (
            parseFloat(hrsOldArray[TODAY_DATA_INDEX]) +
            parseFloat(sztsTimeSessionSpent)
          ).toFixed(2);

          await betterKV.save(
            newState.member.user.id,
            totalAllTime + ',' + totalTodayTime,
            'TotalTimes'
          );
          await updateTopMessage(
            newState.member.user.id,
            totalAllTime,
            ALLTIME_DATA_INDEX
          );
          await updateTopMessage(
            newState.member.user.id,
            totalTodayTime,
            TODAY_DATA_INDEX
          );

          await updateLevel(
            newState.member,
            parseFloat(totalAllTime),
            loginfochannel!,
            memberinfochannel!
          );
        } else {
          //Old DataScheme 'alltime'; Covert to new Data Scheme

          if (isNaN(parseFloat(hrsOld))) {
            await loginfochannel?.sendMessage(
              `Error Occred in Saving (hrsOld): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear: @ ` + //has left the voice channel
                Date.now() +
                '\ntsJoined:' +
                tsJoined +
                ',\nsztsTimeSessionSpent:' +
                sztsTimeSessionSpent +
                ',\nhrsOld:' +
                hrsOld
            );

            await memberinfochannel?.sendMessage(
              `Error Occred in Saving (hrsOld): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear: Please contact Mods.` //has left the voice channel
            );
            return;
          }

          let totalAllTime = (
            parseFloat(hrsOld) + parseFloat(sztsTimeSessionSpent)
          ).toFixed(2);

          await betterKV.save(
            newState.member.user.id,
            totalAllTime + ',' + sztsTimeSessionSpent,
            'TotalTimes'
          );
          await updateTopMessage(
            newState.member.user.id,
            totalAllTime,
            ALLTIME_DATA_INDEX
          );
          await updateTopMessage(
            newState.member.user.id,
            sztsTimeSessionSpent,
            TODAY_DATA_INDEX
          );

          await updateLevel(
            newState.member,
            parseFloat(totalAllTime),
            loginfochannel!,
            memberinfochannel!
          );
        }
      } else {
        // Old time dosent exist; New user
        await betterKV.save(
          newState.member.user.id,
          sztsTimeSessionSpent + ',' + sztsTimeSessionSpent,
          'TotalTimes'
        );
        await updateTopMessage(
          newState.member.user.id,
          sztsTimeSessionSpent,
          ALLTIME_DATA_INDEX
        );
        await updateTopMessage(
          newState.member.user.id,
          sztsTimeSessionSpent,
          TODAY_DATA_INDEX
        );

        await updateLevel(
          newState.member,
          parseFloat(sztsTimeSessionSpent),
          loginfochannel!,
          memberinfochannel!
        );
      }

      let szExtTimeSpent = '';
      let flAdjTimeSpent = parseFloat(sztsTimeSessionSpent);
      if (flAdjTimeSpent > 1.0) {
        szExtTimeSpent += Math.floor(flAdjTimeSpent) + ' `hrs` ';
      }

      szExtTimeSpent +=
        ((flAdjTimeSpent - Math.floor(flAdjTimeSpent)) * 60).toFixed(1) +
        ' `mins`';

      await loginfochannel?.sendMessage(
        `\`${newState.member.user.username}#${
          newState.member.user.discriminator
        }\` (${newState.member.user.toMention()})(${
          newState.member.user.id
        }) has stopped studying :smiling_face_with_tear: @ ` + //has left the voice channel
          Date.now() +
          ` Time spent in this session : ` +
          szExtTimeSpent /*sztsTimeSessionSpent +
          ' hrs'*/
      );

      await memberinfochannel?.sendMessage(
        `\`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying :smiling_face_with_tear: ` + //has left the voice channel
          ` Time spent in this session : ` +
          szExtTimeSpent /*sztsTimeSessionSpent +
          ' hrs'*/
      );
    }
  }

  if (
    newState.channelId === channelIdToWatch &&
    ((newState.selfVideo == true &&
      newState.selfStream == false &&
      oldState.selfStream == false) || // Cam on
      (newState.selfStream == true &&
        newState.selfVideo == false &&
        oldState.selfVideo == false)) // Stream on
  ) {
    //let channel = await discord.getGuildTextChannel(channelId);
    await loginfochannel?.sendMessage(
      `\`${newState.member.user.username}#${
        newState.member.user.discriminator
      }\` (${
        newState.member.user.id
      }) ${newState.member.user.toMention()} has started studying :smirk_cat: @ ` +
        Date.now() //joined the voice channel
    );
    await memberinfochannel?.sendMessage(
      `\`${newState.member.user.username}#${newState.member.user.discriminator}\` has started studying :smirk_cat: ` //joined the voice channel
    );

    await betterKV.del(newState.member.user.id, 'TempTimes');
    // TempTimes Namespace- Saves times for when the user is just connected to Voice Channel; For Later TimeSpent Calculation
    await betterKV.save(newState.member.user.id, Date.now(), 'TempTimes');
  }
});

async function updateLevel(
  userObj: discord.GuildMember,
  totalHrs: number,
  loginfochannel: discord.GuildTextChannel,
  memberinfochannel: discord.GuildTextChannel
) {
  let rolesUserHas = userObj.roles;
  let userHasaLevelRole = false;

  // Totalhrs even less than Lowest level
  if (totalHrs <= arrHoursLevels[0][0]) return;

  let guild = await discord.getGuild();

  for (let userRole in rolesUserHas) {
    for (let levelRoleID in arrHoursLevels) {
      /*console.log(
        'levelRoleID : ' +
          levelRoleID +
          ', userRole : ' +
          userRole +
          ', arrHoursLevels[levelRoleID][1] : ' +
          arrHoursLevels[levelRoleID][1] +
          ', rolesUserHas[userRole]: ' +
          rolesUserHas[userRole]
      );*/
      if (rolesUserHas[userRole] == arrHoursLevels[levelRoleID][1]) {
        userHasaLevelRole = true;
        if (totalHrs > arrHoursLevels[levelRoleID][0]) {
          //Time for rankup.
          let newLevel = parseInt(levelRoleID);
          for (let j = parseInt(levelRoleID); j < arrHoursLevels.length; j++) {
            if (totalHrs > arrHoursLevels[j][0]) newLevel = j;
            if (totalHrs < arrHoursLevels[j][0]) break;
          }
          //Same level
          if (newLevel == parseInt(levelRoleID)) return;

          //loginfochannel.sendMessage('Time for rankup to Level  ' + newLevel);

          await userObj.removeRole(rolesUserHas[userRole]);
          await userObj.addRole(arrHoursLevels[newLevel][1].toString());

          await loginfochannel.sendMessage(
            'removing role : ' +
              rolesUserHas[userRole] +
              ' & Added role : ' +
              arrHoursLevels[newLevel][1]
          );

          let fromRole = await guild.getRole(rolesUserHas[userRole]);
          let toRole = await guild.getRole(
            arrHoursLevels[newLevel][1].toString()
          );

          await memberinfochannel.sendMessage({
            content:
              `\`${userObj.user.getTag()}\` has ranked up to Level: **` +
              toRole?.name +
              `**(${toRole?.toMention()}) from Level: ` +
              fromRole?.name +
              ` (${fromRole?.toMention()})`,
            allowedMentions: {}
          });
          await loginfochannel.sendMessage(
            `\`${userObj.user.getTag()}\`(${
              userObj.user.id
            }) ${userObj.toMention()} has ranked up to **` +
              toRole?.name +
              `**(${toRole?.toMention()}) from ` +
              fromRole?.name +
              ` (${fromRole?.toMention()})`
          );
          return;
        }

        /*let resu = await userObj.removeRole(rolesUserHas[userRole]);
        console.log(
          'removing role : ' + rolesUserHas[userRole] + ' Result : ' + resu
        );*/
      }
    }
  }

  if (!userHasaLevelRole) {
    let newLevel = 0;
    for (let j = newLevel; j < arrHoursLevels.length; j++) {
      if (totalHrs > arrHoursLevels[j][0]) newLevel = j;
      if (totalHrs < arrHoursLevels[j][0]) break;
    }

    await userObj.addRole(arrHoursLevels[newLevel][1].toString());
    let toRole = await guild.getRole(arrHoursLevels[newLevel][1].toString());

    /*console.log(
      'Added role : ' + arrHoursLevels[newLevel][1] + ' Result : ' + resu
    );*/
    await memberinfochannel.sendMessage({
      content:
        `\`${userObj.user.getTag()}\` has ranked up to Level: **` +
        toRole?.name +
        `** (${toRole?.toMention()})`,
      allowedMentions: {}
    });
    await loginfochannel.sendMessage({
      content:
        `\`${userObj.user.getTag()}\`(${
          userObj.user.id
        }) ${userObj.toMention()} has ranked up to Level: **` +
        toRole?.name +
        `** (${toRole?.toMention()})`,
      allowedMentions: {}
    });
  }
}

adminCommands.on(
  'testlvl',
  (args) => ({
    allTime: args.number()
  }),
  async (message, { allTime }) => {
    let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
    let memberinfochannel = await discord.getGuildTextChannel(channelId);
    await updateLevel(
      message.member,
      allTime,
      loginfochannel!,
      memberinfochannel!
    );
  }
);

async function autoBackup_force() {
  let allEntries = await betterKV.getEntries('TotalTimes');

  //console.log(allEntries);
  await autoBackup(allEntries);
}

async function autoBackup(allEntries: any) {
  let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);

  loginfochannel?.triggerTypingIndicator();
  await sleep(1300);

  await loginfochannel?.sendMessage('\t\tStarting **Daily Backup**...');
  try {
    const channel = await discord.getGuildTextChannel(topMessageChannelID);
    await testVar(
      channel,
      loginfochannel!,
      `Error: discord.getGuildTextChannel('${topMessageChannelID}') returned channel = `
    );

    let topMessage = await channel?.getMessage(
      topMessageIDArray[TODAY_DATA_INDEX]
    );
    await testVar(
      topMessage,
      loginfochannel!,
      `Error: channel?.getMessage('${topMessageIDArray[TODAY_DATA_INDEX]}') returned topMessage = `
    );

    const dataTodayTop = topMessage?.content!;
    await testVar(
      dataTodayTop,
      loginfochannel!,
      `Error: topMessage?.content returned dataTodayTop = `
    );

    topMessage = await channel?.getMessage(
      topMessageIDArray[ALLTIME_DATA_INDEX]
    );
    await testVar(
      topMessage,
      loginfochannel!,
      `Error: channel?.getMessage('${topMessageIDArray[ALLTIME_DATA_INDEX]}') returned topMessage = `
    );

    const dataAllTimeTop = topMessage?.content!;
    await testVar(
      dataAllTimeTop,
      loginfochannel!,
      `Error: topMessage?.content returned dataAllTimeTop = `
    );

    //let allEntries = await betterKV.getEntries('TotalTimes');
    let jsonBackupString = '{';
    let kv;

    for (kv in allEntries) {
      jsonBackupString += `"${allEntries[kv][0]}":"${allEntries[kv][1]}",\n`;
    }
    jsonBackupString += '}';

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage('dataTodayTop, dataAllTimeTop ...');

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage(dataTodayTop);

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage(dataAllTimeTop);

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage({
      content: '\n**Backup** Completed.\nPacked jsonKVs',
      attachments: [
        {
          name: 'bakupdata.txt',
          data: new TextEncoder().encode(jsonBackupString).buffer
        }
      ]
    });
  } catch (error) {
    if (error instanceof discord.ApiError) {
      await loginfochannel?.sendMessage(
        `discord.ApiError caught: Code: ${error.code}\n` +
          `Endpoint: ${error.endpoint}\n` +
          `httpMethod: ${error.httpMethod}\n` +
          `httpStatus: ${error.httpStatus}\n` +
          `httpStatusText: ${error.httpStatusText}\n` +
          `message: ${error.message}\n` +
          `name: ${error.name}\n` +
          `stack: ${error.stack}\n`
      );
    } else {
      await loginfochannel?.sendMessage(`General Error caught: ` + error);
    }
  }
}

async function testVar(
  variable: any,
  loginfochannel: discord.GuildTextChannel,
  msg: string
) {
  if (variable == null || variable == undefined) {
    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage(msg + variable);
  }
}

async function cron_task() {
  let topMessageID = topMessageIDArray[TODAY_DATA_INDEX];
  let msg = "*yesterday's* **LeaderBoard** \n\n";
  let logmsg = "*yesterday's* **LeaderBoard** \n\n";

  let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
  await loginfochannel?.sendMessage('**Cron Task** Starting....');

  try {
    const channel = await discord.getGuildTextChannel(topMessageChannelID);
    await testVar(
      channel,
      loginfochannel!,
      `Error: discord.getGuildTextChannel('${topMessageChannelID}') returned channel = `
    );

    const topMessage = await channel?.getMessage(topMessageID);
    await testVar(
      topMessage,
      loginfochannel!,
      `Error: channel?.getMessage('${topMessageID}') returned topMessage = `
    );

    const jsonTop = JSON.parse(topMessage?.content!);

    let memberinfochannel = await discord.getGuildTextChannel(channelId);
    await testVar(
      memberinfochannel,
      loginfochannel!,
      `Error: discord.getGuildTextChannel('${channelId}') returned memberinfochannel = `
    );

    let i = 1;

    for (let key in jsonTop) {
      const u = await discord.getUser(key);
      await testVar(
        u,
        loginfochannel!,
        `Error: discord.getUser(('${key}') returned u = `
      );

      msg +=
        i +
        '. ' +
        `\`${u?.username}#${u?.discriminator}\` (${jsonTop[key]} hrs)\n`;

      logmsg += i + '. ' + `<@!${u?.id}> (${jsonTop[key]} hrs)\n`;
      i++;
    }
    memberinfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await memberinfochannel?.sendMessage(msg);
    await sleep(1200);
    await sendTopPicToChannel(
      memberinfochannel!,
      loginfochannel!,
      TODAY_DATA_INDEX
    );

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage(logmsg);

    let allKeys = await betterKV.getEntries('TotalTimes');
    await autoBackup(allKeys);

    //console.log(allKeys);
    //let value;
    const result = await pylon.requestCpuBurst(async () => {
      // your code
      for (let kv in allKeys) {
        //console.log(allKeys[kv]);
        //value = <string>await betterKV.get(allKeys[key], 'TotalTimes');
        if ((allKeys[kv][1] as string)!.indexOf(',') != -1) {
          // New DataScheme
          await betterKV.save(
            allKeys[kv][0],
            (allKeys[kv][1] as string).split(',')[0] + ',0',
            'TotalTimes'
          );
        }
      }
    }, 3000);

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage(
      'BurstCPU Result :\n' +
        'bucketMaximumMs: ' +
        result.bucketMaximumMs +
        '\n' +
        'bucketRemainingMs: ' +
        result.bucketRemainingMs +
        '\n' +
        'bucketResetInMs: ' +
        result.bucketResetInMs +
        '\n' +
        'result: ' +
        result.result +
        '\n' +
        'usedCpuMs: ' +
        result.usedCpuMs +
        '\n'
    );

    //loginfochannel?.sendMessage('LeaderboardData: ' + topMessage?.content!);
    await topMessage?.edit('{}');

    loginfochannel?.triggerTypingIndicator();
    await sleep(1200);
    await loginfochannel?.sendMessage(
      "**Cron Task** Completed. Cleared Yesterday's Leaderboard."
    );
  } catch (error) {
    if (error instanceof discord.ApiError) {
      await loginfochannel?.sendMessage(
        `discord.ApiError caught: Code: ${error.code}\n` +
          `Endpoint: ${error.endpoint}\n` +
          `httpMethod: ${error.httpMethod}\n` +
          `httpStatus: ${error.httpStatus}\n` +
          `httpStatusText: ${error.httpStatusText}\n` +
          `message: ${error.message}\n` +
          `name: ${error.name}\n` +
          `stack: ${error.stack}\n`
      );
    } else {
      await loginfochannel?.sendMessage(`General Error caught: ` + error);
    }
  }
}

//IST 0330 HRS = UTC 2200 HRS
pylon.tasks.cron('cron_task', '0 0 22 * * * *', async () => {
  await cron_task();
});
