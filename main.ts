import * as betterKV from './betterKV';

let topMessageIDArray = ['927190278853513216', '927190300424810537']; // Default MessageID values

let loginfoChannelID = '850411914815471639';
let topMessageChannelID = loginfoChannelID; // Same as Log-Info Channel

let channelId = '780116866484011040'; // Channel to send Normal bot(non-log) response messages & To receive bot userCmds
let channelToSwitch = '770632381598138431'; // Silent-self-study channel | Channel to switch to if Member not turning on CAM/SS in ONLY channels

let channelCategoriesToWatch = ['874359220181536849', '910598376893063188']; // All Study Over Cam/SS Channels category
let channelCategoriesCamSSOnlyToWatchCheck = ['874359220181536849']; // Study Over Cam/SS ONLY categories - for AFK Check; will be moved if not using Cam /SS

let leaderboardchannel = '940621960768004106'; // Channel to send daily Leaderboard top messages to

let defaultPrefix = '$';

let ALLTIME_DATA_INDEX = 0;
let TODAY_DATA_INDEX = 1;
let TopMsgIDsKeys = ['ALLTIME_TOP_MSGID', 'TODAY_TOP_MSGID'];

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
  [420, '857505019985395732'], //Study Lord
  [500, '863889975753834516'], //Noble 500-580h
  [580, '863892097375272970'], //Savant -660h
  [660, '863891395075768341'], //Sage 660-720h
  [720, '863892888180883467'] //Grand Sage, 720h+
];

let VoteRoles = [
  // Roles who can vote to scrutinize !addhrs cmd
  '857502270535368725', //Learner;
  '857502562956738560', //Ambitious;
  '857502927634432041', //Momentous;
  '857503167982075924', //Studious ;
  '857503357304045568', //A+ Student
  '857503593296298015', //Scholar
  '857504034969747456', //Guru
  '857504345644990474', //Study Master
  '857505019985395732', //Study Lord
  '863889975753834516', //Noble 500-580h
  '863892097375272970', //Savant -660h
  '863891395075768341', //Sage 660-720h
  '863892888180883467', //Grand Sage, 720h+
  '785381822405935105', //Supporters
  '940804449876729927', //Community Pillars

  // TEST ROLES:
  '857696219971059723', // Spark -- Level 1;
  '857696370197659688', // Beginner -- Level 2;
  '857696421158584340', // Learner -- Level 3;
];

let pVoteRoles = [
  // Permanant voters - whos vote is final and binding
  '814018550942924860', // Moderators
  '927187026804092948', // MoHA Manger
  '881487350704791552', // Sr. Moderator
  '767615532563431424', // Manager
  '767015774266851378', // Admin

  // TEST ROLES:
  '842030013801037855', // Pylon Administrator
];

let modRole = '927187026804092948'; // MohaManager Role on UPSC Server

// SK Test Server roles
/*let arrHoursLevels = [
  [0.5, '857696219971059723'], //Spark -- Level 1;
  [6, '857696370197659688'], //Beginner -- Level 2;
  [12, '857696421158584340'] //Learner -- Level 3;
];*/

let sendPictureTopTen = true;
/***********
 * Dont edit anything Above this Line. These are Server Specific Settings.
 **********/
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
 *  runcroncheck - rechecks if the daily LB Reset task is sucessfully run or not, else restarts the dailyreset task
 *  runabackup - forcefully run only autobackup of db  (normally run with cron task @ 3.00 AM)
 *  testlvl <hrs> - Run levels algorithm on you and assign you a level role wrt hrs passed.
 *  cleardbentry <dbKey> - Will delete the database Entry identified by dbKey
 *  loadbackup <DBJson> - will add/updates all DBJson values into database
 *  removelevelroles - will remove all level roles from all members
 *  settopmsgids <alltime_msgid> <today_msgid> - will set message ids for all_time and today TOP list in a discord message
 *  deletealltimedata - Deletes all study time data from bot db - Be Extra carefull while using this command (thats why the cmd name is also KEPT long)
 */

// Here's an example of how to use the built in command handler.
const userCommands = new discord.command.CommandGroup({
  filters: discord.command.filters.or(
    discord.command.filters.isChannelId(channelId),
    discord.command.filters.isChannelId(loginfoChannelID)
  ),
  defaultPrefix: defaultPrefix, // You can customize your default prefix here.
});

const adminCommands = new discord.command.CommandGroup({
  filters: discord.command.filters.and(
    discord.command.filters.isChannelId(loginfoChannelID),
    discord.command.filters.or(
      discord.command.filters.isAdministrator(),
      discord.command.filters.hasRole(modRole)
    )
  ),
  defaultPrefix: defaultPrefix, // You can customize your default prefix here.
});

const modsCommands = new discord.command.CommandGroup({
  filters: discord.command.filters.and(
    discord.command.filters.isChannelId(loginfoChannelID)
  ),
  defaultPrefix: defaultPrefix, // You can customize your default prefix here.
});

async function getTopMessageID(what: number): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    if (!(await betterKV.exist(TopMsgIDsKeys[what], 'MohaAdmin')))
      await betterKV.save(
        TopMsgIDsKeys[what],
        topMessageIDArray[what],
        'MohaAdmin'
      );

    resolve((await betterKV.get<string>(TopMsgIDsKeys[what], 'MohaAdmin'))!);
  });
}

async function updateTopMessage(
  userID: string,
  userHrs: string,
  topMessageType: number
) {
  const channel = await discord.getGuildTextChannel(topMessageChannelID);
  const topMessage = await channel?.getMessage(
    await getTopMessageID(topMessageType)
  );

  //console.log('awaiting for Message ... got userHrs as ' + userHrs);
  /*let topMessage = await discord
    .getTextChannel(topMessageChannelID)
    .then((c) => c?.getMessage(topMessageID));*/
  //console.log('awaiting done parsing json  ...' + topMessage?.content);

  let jsonTop = JSON.parse(topMessage?.content!);
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
    if (key == userID && jsonTop[key] <= 0) {
      numObjects--;
      continue;
    }
    sortable.push([key, jsonTop[key]]);
  }

  sortable.sort(function (a, b) {
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
    await getTopMessageID(topMessageType)
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

  sortable.sort(function (a, b) {
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
  ':nine:',
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
            url: userObj.getAvatarUrl(),
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
            text: 'Type `' + defaultPrefix + 'lb` to see the leaderboard',
          },
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
    user: args.userOptional(),
  }),
  async (message, { user }) => {
    if (await userInteraction(message)) return;
    if (user != null) {
      await showUserIDTotalTime(message, user);
    } else {
      await showUserIDTotalTime(message, message.member.user);
    }
  }
);

async function updateStickyTodayLB(
  channelToSend:
    | discord.GuildTextChannel
    | discord.GuildNewsChannel
    | discord.DmChannel
) {
  try {
    let msgid = await betterKV.get<string>('STICKY_MSGID', 'MohaAdmin');

    if (msgid != undefined && msgid.length > 1) {
      await (await channelToSend.getMessage(msgid))?.delete();
      await betterKV.save('STICKY_MSGID', '', 'MohaAdmin');
    }
    let reply = await channelToSend.sendMessage(await makeTodayLBText());
    await betterKV.save('STICKY_MSGID', reply.id, 'MohaAdmin');
  } catch (e) {
    await handleError(e);
  }
}

discord.on('MESSAGE_CREATE', async (message) => {
  try {
    if (message.channelId == channelId)
      await updateStickyTodayLB(await message.getChannel());
  } catch (e) {
    await handleError(e);
  }
});

async function makeTodayLBText(): Promise<string> {
  return new Promise<string>(async (resolve) => {
    try {
      let topMessageID = await getTopMessageID(TODAY_DATA_INDEX);
      let msg = ':pushpin: **LeaderBoard** (__Today__)\n\n';

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

      if (i > 1) resolve(msg);
      else {
        resolve(
          "Today's Leaderboard is empty, Be the first one to start studing and get on it !! :)"
        );
      }
    } catch (e) {
      await handleError(e);
    }
  });
}

userCommands.on(
  'lb',
  (args) => ({ what: args.stringOptional() }),
  async (message, { what }) => {
    if (await userInteraction(message)) return;

    let topMessageID = await getTopMessageID(TODAY_DATA_INDEX);
    let msg = '**LeaderBoard** (__Today__)\n\n';

    if (what != null) {
      topMessageID = await getTopMessageID(ALLTIME_DATA_INDEX);
      msg = '**LeaderBoard** (__AllTime__)\n\n';
    } /*else {
      await updateStickyTodayLB(await message.getChannel());
    }*/

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
  if (await userInteraction(message)) return;
  // Respond to the message, pinging the author.
  await setTotalHrs(-1, 0, message, message.member.user);
  /*
  let exits = await betterKV.exist(message.member.user.id, 'TotalTimes');
  if (exits) {
    let totalTime = await betterKV.get(message.member.user.id, 'TotalTimes');
    await message.reply(
      `\`${message.member.user.username}#${message.member.user.discriminator}\` has spent ` +
        totalTime +
        ` hrs`
    );
    //betterKV.del(message.member.user.id, 'TotalTimes');
    await message.reply(
      `\`${message.member.user.username}#${message.member.user.discriminator}\` cleared his data`
    );
  } else {
    await message.reply(
      `\`${message.member.user.username}#${message.member.user.discriminator}\` cleared his inexistent data :O`
    );
  }*/
});

// A simple command, !ping -> Pong!
userCommands.raw('ping', async (message) => {
  message.reply('Hi Nub !');
  console.log('Ping Called');
});

// Time : -1 -> Leave previous TotalTime Hrs
async function setTotalHrs(
  time: number,
  todaytime: number,
  message: discord.Message,
  userObj: discord.User
) {
  if (isNaN(time) || isNaN(todaytime)) return;

  let exits = await betterKV.exist(userObj.id, 'TotalTimes');

  if (exits) {
    let origTime = (await betterKV.get<string>(userObj.id, 'TotalTimes'))!;
    if (origTime.indexOf(',') != -1) {
      //New DataScheme {altime, today}
      let origTimeArray = origTime.split(',');

      await message.inlineReply(
        `${userObj.toMention()} \`${userObj.username}#${
          userObj.discriminator
        }\`'s Total time has been modified from \`` +
          origTimeArray[ALLTIME_DATA_INDEX] +
          ':' +
          origTimeArray[TODAY_DATA_INDEX] +
          '` to `' +
          (time < 0 ? origTimeArray[ALLTIME_DATA_INDEX] : time.toFixed(2)) +
          ':' +
          todaytime.toFixed(2) +
          `\` hrs by ${
            message.member ? message.member?.user.toMention() : 'server.'
          }`
      );
      await betterKV.save(
        userObj.id,
        (time < 0 ? origTimeArray[ALLTIME_DATA_INDEX] : time.toFixed(2)) +
          ',' +
          todaytime.toFixed(2),
        'TotalTimes'
      );
      await updateTopMessage(
        userObj.id,
        time < 0 ? origTimeArray[ALLTIME_DATA_INDEX] : time.toFixed(2),
        ALLTIME_DATA_INDEX
      );
      await updateTopMessage(
        userObj.id,
        todaytime.toFixed(2),
        TODAY_DATA_INDEX
      );
    } else {
      //Old DataScheme 'altime', Convert

      await message.inlineReply(
        `${userObj.toMention} \`${userObj.username}#${userObj.discriminator}\`'s Total time has been modified from \`` +
          origTime +
          '` to `' +
          (time < 0 ? todaytime.toFixed(2) : time.toFixed(2)) +
          ':' +
          todaytime.toFixed(2) +
          `\` hrs by ${
            message.member ? message.member?.user.toMention() : 'server.'
          }`
      );

      await betterKV.save(
        userObj.id,
        (time < 0 ? todaytime.toFixed(2) : time.toFixed(2)) +
          ',' +
          todaytime.toFixed(2),
        'TotalTimes'
      );
      await updateTopMessage(
        userObj.id,
        time < 0 ? todaytime.toFixed(2) : time.toFixed(2),
        ALLTIME_DATA_INDEX
      );
      await updateTopMessage(
        userObj.id,
        todaytime.toFixed(2),
        TODAY_DATA_INDEX
      );
    }
  } else {
    await message.inlineReply(
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
    await updateTopMessage(userObj.id, time.toFixed(2), ALLTIME_DATA_INDEX);
    await updateTopMessage(userObj.id, todaytime.toFixed(2), TODAY_DATA_INDEX);
  }
}

// deletealltimedata
adminCommands.raw('deletealltimedata', async (message) => {
  try {
    if (
      (await betterKV.clear('TempTimes'))! &&
      (await betterKV.clear('TotalTimes'))! &&
      (await betterKV.clear('HrsWatchVotes'))!
    )
      await message.reply(
        `Sucessfully deleted all StudyTime data by ${message.author.toMention()}`
      );
  } catch (error) {
    await handleError(error);
  }
});

// settopmsgids
adminCommands.on(
  'settopmsgids',
  (args) => ({
    alltime_msgid: args.string(),
    today_msgid: args.string(),
  }),
  async (message, { alltime_msgid, today_msgid }) => {
    try {
      if (alltime_msgid == null || today_msgid == null)
        return await message.reply(
          `Usage: ${defaultPrefix}settopmsgids <alltime_msgid> <today_msgid> - will set messageIDs for ALL_TIME_TOP and TODAY_TOP list in a discord message`
        );

      let origAll = await betterKV.get<string>(
        TopMsgIDsKeys[ALLTIME_DATA_INDEX],
        'MohaAdmin'
      );
      let origToday = await betterKV.get<string>(
        TopMsgIDsKeys[TODAY_DATA_INDEX],
        'MohaAdmin'
      );

      await betterKV.save(
        TopMsgIDsKeys[TODAY_DATA_INDEX],
        today_msgid,
        'MohaAdmin'
      );
      await betterKV.save(
        TopMsgIDsKeys[ALLTIME_DATA_INDEX],
        alltime_msgid,
        'MohaAdmin'
      );

      return await message.reply(
        `Sucessfully set **ALLTIME**_TOP_MSGID to \`${alltime_msgid}\`(from \`${origAll}\`) and **TODAY**_TOP_MSGID to \`${today_msgid}\`(from \`${origToday}\`) by ${message.author.toMention()}`
      );
    } catch (error) {
      await handleError(error);
    }
  }
);

function userHasRole(userRoles: any, rolestoCheck: any) {
  for (let userRole in userRoles) {
    for (let testRole in rolestoCheck) {
      if (userRoles[userRole] == rolestoCheck[testRole]) {
        return userRoles[userRole];
      }
    }
  }
  return false;
}

// addmins
userCommands.on(
  'addmins',
  (args) => ({
    Minutes: args.number(),
    reason: args.text(),
    //user: args.userOptional(),
  }),
  async (message, { /*user,*/ Minutes, /*addTime,*/ reason }) => {
    try {
      let addToUser = message.author;
      //if (user != null) addToUser = user;

      let newTotalTime: number, newTodayTime: number;
      let origTimearray = ['0.0', '0.0'];

      let exits = await betterKV.exist(addToUser.id, 'TotalTimes');
      if (exits) {
        origTimearray = (await betterKV.get<string>(
          addToUser.id,
          'TotalTimes'
        ))!.split(',');
      }

      let addTime = parseFloat((Minutes / 60).toFixed(2));

      newTodayTime = parseFloat(
        (parseFloat(origTimearray[TODAY_DATA_INDEX]) + addTime).toFixed(2)
      );
      newTotalTime = parseFloat(
        (parseFloat(origTimearray[ALLTIME_DATA_INDEX]) + addTime).toFixed(2)
      );

      await setTotalHrs(newTotalTime, newTodayTime, message, addToUser);

      /*await message.inlineReply(
      `Sorry for the inconvinience. Added the requested hours.\nReporter: ${message.author.toMention()} \`(${
        message.author.username
      }#${message.author.discriminator})(${
        message.author.id
      })\`\nAdded to user: ${addToUser.toMention()} \`(${addToUser.username}#${
        addToUser.discriminator
      })(${addToUser.id})\`\nInitial Total hrs: \`${
        origTimearray[TODAY_DATA_INDEX]
      }\`\nInitial Today hrs: \`${
        origTimearray[ALLTIME_DATA_INDEX]
      }\`\nHrs Added: ${addTime}\nReason: \`${reason}`
    );*/

      // NOTE: Editing this needs line 813 to be redone.
      let msgsent = await message.inlineReply(
        `Sorry for the inconvinience if I missed it :pleading_face:. Added the requested hours.\nAdded to user: ${addToUser.toMention()} \`(${
          addToUser.username
        }#${addToUser.discriminator})(${
          addToUser.id
        })\`\nInitial Total hrs: \`${
          origTimearray[TODAY_DATA_INDEX]
        }\`\nInitial Today hrs: \`${
          origTimearray[ALLTIME_DATA_INDEX]
        }\`\nHrs Added: \`${addTime}\`\nReason: \`${reason}\``
      );

      await msgsent.addReaction('⬆️');
      await msgsent.addReaction('⬇️');
      await betterKV.save(msgsent.id, Date.now(), 'HrsWatchVotes');
    } catch (e) {
      await handleError(e);
    }
  }
);

discord.on('MESSAGE_REACTION_ADD', reThinkTimeAddedRAdded);
discord.on('MESSAGE_REACTION_REMOVE', reThinkTimeAddedRRemoved);
//discord.on('MESSAGE_REACTION_REMOVE_ALL', reThinkTimeAdded);

async function reThinkTimeAddedRAdded(
  message: discord.Event.IMessageReactionRemove
) {
  await reThinkTimeAddedCommon(message, true);
}

async function reThinkTimeAddedRRemoved(
  message: discord.Event.IMessageReactionRemove
) {
  await reThinkTimeAddedCommon(message, false);
}

async function reThinkTimeAddedCommon(
  message: discord.Event.IMessageReactionRemove,
  radded: boolean
) {
  try {
    if (message.emoji.name != '⬆️' && message.emoji.name != '⬇️') return;

    let timeaddedTS = await betterKV.get<string>(
      message.messageId,
      'HrsWatchVotes'
    );
    if (timeaddedTS == undefined) return;

    //console.log(Date.now() - parseInt(timeaddedTS));

    if (Date.now() - parseInt(timeaddedTS) > 3 * 24 * 60 * 60 * 1000) {
      await modlog(
        `Info: \`${message.member!.user.username}#${
          message.member!.user.discriminator
        } (${message.userId})\` tried to ${radded ? 'vote' : 'remove vote'} ${
          message.emoji.name
        } on an >3 Days older request now. Deleting related \`HrsWatchVotes\` for msgid=\`${
          message.messageId
        }\` with ts=\`${timeaddedTS}\` now @ \`${Date.now()}\`.`
      );
      await betterKV.del(message.messageId, 'HrsWatchVotes');
      return;
    }

    let channel = await discord.getGuildTextChannel(message.channelId);
    let actMsg = await channel!.getMessage(message.messageId);

    let isPVoter = userHasRole(message.member!.roles, pVoteRoles);
    let voterRole = userHasRole(message.member!.roles, VoteRoles);

    if (!voterRole && !isPVoter) {
      await actMsg!.deleteReaction(message.emoji.name, message.member!.user);
      return;
    }

    //console.log(message);
    /*
    Object {guildId: "823944652850987008", member: GuildMember, emoji: Emoji, userId: "317716017931485195", channelId: "848836989700407316"…}
    guildId: "823944652850987008"
    member: GuildMember
      permissions: 2147483647
      communicationDisabledUntil: null
      user: User
      joinedAt: "2021-03-23T15:41:53.395Z"
      guildId: "823944652850987008"
      pending: false
      <constructor>: "GuildMember"
      nick: null
      roles: Array[4]
      premiumSince: null
    emoji: Emoji
      id: null
      roles: Array[0]
      managed: false
      animated: false
      name: "🥰"
      user: null
      requireColons: false
      type: "UNICODE"
      <constructor>: "Emoji"
        name: "Emoji"
    userId: "317716017931485195"
    channelId: "848836989700407316"
    messageId: "997572679001448569"
  */
    //console.log(actMsg!.reactions.flat());
    /*
    [Object, Object, Object]
    0: Object
      emoji: Object
      id: null
      name: "⬆️"
      count: 2
      me: true
    1: Object
      emoji: Object
      id: null
      name: "⬇️"
      count: 2
      me: true
    2: Object
      emoji: Object
      id: null
      name: "🥰"
      count: 1
      me: false
  */
    let upvotes = 0,
      downvotes = 0;

    actMsg!.reactions.flat().forEach(function (currentValue, index, arr) {
      if (currentValue.emoji.name == '⬆️') upvotes = currentValue.count;
      if (currentValue.emoji.name == '⬇️') downvotes = currentValue.count;
    });

    //console.log(actMsg!.content);

    if (
      (upvotes > downvotes && !isPVoter) ||
      (isPVoter && radded && message.emoji.name == '⬆️')
    ) {
      var matches = actMsg!.content.match(
        /(Sorry for the inconvinience if I missed it :pleading_face:. Added the requested hours.\nAdded to user: <@(.*?)> .*\n.*\n.*\nHrs Added: )~~(.*?)~~(\n.*)/
      );

      let doNotModfiyTime = false;
      if (matches == null && isPVoter) {
        matches = actMsg!.content.match(
          /(Sorry for the inconvinience if I missed it :pleading_face:. Added the requested hours.\nAdded to user: <@(.*?)> .*\n.*\n.*\nHrs Added: )`(.*?)`(\n.*)/
        );
        doNotModfiyTime = true;
      }
      //console.log(matches);

      if (matches != null) {
        var id = matches![2];
        var hrsadded = parseFloat(matches![3]);
        //console.log('Should add time for id=' + id + ' by hrsadded=' + hrsadded);

        let addToUser = await discord.getUser(id);

        await modlog({
          content: `Voter \`${message.member!.user.username}#${
            message.member!.user.discriminator
          } (${
            message.userId
          })\` <@&${voterRole}> has actionably(regex found) ${
            radded ? 'voted' : 'removed'
          } ${message.emoji.name} on msgid=\`${
            message.messageId
          }\` in channelid=\`${
            message.channelId
          }\` \nUp:${upvotes}, Down:${downvotes} \nKV data for the same with TS=\`${timeaddedTS}\`, \nNow Should add time(doNotModfiyTime=\`${doNotModfiyTime}\`) for user=\`${
            addToUser!.username
          }#${addToUser!.discriminator} (${id})\` by hrs=\`${hrsadded}\` `,
          allowedMentions: {},
        });

        let newTotalTime: number, newTodayTime: number;
        let origTimearray = ['0.0', '0.0'];

        let exits = await betterKV.exist(addToUser!.id, 'TotalTimes');
        if (exits) {
          origTimearray = (await betterKV.get<string>(
            addToUser!.id,
            'TotalTimes'
          ))!.split(',');
        }

        newTodayTime = parseFloat(
          (parseFloat(origTimearray[TODAY_DATA_INDEX]) + hrsadded).toFixed(2)
        );
        newTotalTime = parseFloat(
          (parseFloat(origTimearray[ALLTIME_DATA_INDEX]) + hrsadded).toFixed(2)
        );

        if (!doNotModfiyTime)
          await setTotalHrs(newTotalTime, newTodayTime, actMsg!, addToUser!);

        if (!isNaN(hrsadded)) {
          await actMsg!.edit(
            matches![1] +
              '`' +
              hrsadded +
              '`' +
              matches![4] +
              (isPVoter
                ? `\nPermanently set by mod: \`${
                    message.member!.user.username
                  }#${message.member!.user.discriminator} (${
                    message.member!.user.id
                  })\``
                : '')
          );

          if (isPVoter) {
            await modlog({
              content: `Permanent Voter \`${message.member!.user.username}#${
                message.member!.user.discriminator
              } (${message.userId})\` <@&${isPVoter}> has voted ${
                message.emoji.name
              } on msgid=\`${message.messageId}\` in channelid=\`${
                message.channelId
              }\` \nNow Removing KV data for the same with TS=\`${timeaddedTS}\`.`,
              allowedMentions: {},
            });
            await betterKV.del(message.messageId, 'HrsWatchVotes');
          }
        }
      }
    } else if (
      (downvotes > upvotes && !isPVoter) ||
      (isPVoter && radded && message.emoji.name == '⬇️')
    ) {
      var matches = actMsg!.content.match(
        /(Sorry for the inconvinience if I missed it :pleading_face:. Added the requested hours.\nAdded to user: <@(.*?)> .*\n.*\n.*\nHrs Added: )`(.*?)`(\n.*)/
      );
      //console.log(matches);
      let doNotModfiyTime = false;
      if (matches == null && isPVoter) {
        matches = actMsg!.content.match(
          /(Sorry for the inconvinience if I missed it :pleading_face:. Added the requested hours.\nAdded to user: <@(.*?)> .*\n.*\n.*\nHrs Added: )~~(.*?)~~(\n.*)/
        );
        doNotModfiyTime = true;
      }

      if (matches != null) {
        var id = matches![2];
        var hrsadded = parseFloat(matches![3]);
        let addToUser = await discord.getUser(id);

        await modlog({
          content: `Voter \`${message.member!.user.username}#${
            message.member!.user.discriminator
          } (${
            message.userId
          })\` <@&${voterRole}> has actionably(regex found) ${
            radded ? 'voted' : 'removed'
          } ${message.emoji.name} on msgid=\`${
            message.messageId
          }\` in channelid=\`${
            message.channelId
          }\` \nUp:${upvotes}, Down:${downvotes} \nKV data for the same with TS=\`${timeaddedTS}\`, \nNow Should deduct time(doNotModfiyTime=\`${doNotModfiyTime}\`) for user=\`${
            addToUser!.username
          }#${addToUser!.discriminator} (${id})\` by hrs=\`${hrsadded}\``,
          allowedMentions: {},
        });

        let newTotalTime: number, newTodayTime: number;
        let origTimearray = ['0.0', '0.0'];

        let exits = await betterKV.exist(addToUser!.id, 'TotalTimes');
        if (exits) {
          origTimearray = (await betterKV.get<string>(
            addToUser!.id,
            'TotalTimes'
          ))!.split(',');
        }

        newTodayTime = parseFloat(
          (parseFloat(origTimearray[TODAY_DATA_INDEX]) - hrsadded < 0
            ? 0
            : parseFloat(origTimearray[TODAY_DATA_INDEX]) - hrsadded
          ).toFixed(2)
        );
        newTotalTime = parseFloat(
          (parseFloat(origTimearray[ALLTIME_DATA_INDEX]) - hrsadded < 0
            ? 0
            : parseFloat(origTimearray[ALLTIME_DATA_INDEX]) - hrsadded
          ).toFixed(2)
        );

        if (!doNotModfiyTime)
          await setTotalHrs(newTotalTime, newTodayTime, actMsg!, addToUser!);

        if (!isNaN(hrsadded)) {
          await actMsg!.edit(
            matches![1] +
              '~~' +
              hrsadded +
              '~~' +
              matches![4] +
              (isPVoter
                ? `\nPermanently set by mod: \`${
                    message.member!.user.username
                  }#${message.member!.user.discriminator} (${
                    message.member!.user.id
                  })\``
                : '')
          );

          if (isPVoter) {
            await modlog({
              content: `Permanent Voter \`${message.member!.user.username}#${
                message.member!.user.discriminator
              } (${message.userId})\` <@&${isPVoter}> has voted ${
                message.emoji.name
              } on msgid=\`${message.messageId}\` in channelid=\`${
                message.channelId
              }\` \nNow Removing KV data for the same with TS=\`${timeaddedTS}\`.`,
              allowedMentions: {},
            });
            await betterKV.del(message.messageId, 'HrsWatchVotes');
          }
        }
      }
    }
  } catch (e) {
    await handleError(e);
  }
}

// setthrs
adminCommands.on(
  'setthrs',
  (args) => ({
    user: args.user(),
    allTime: args.number(),
    todayTime: args.number(),
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

adminCommands.raw('runcroncheck', async (message) => {
  await checkAndRestartDailyResetTask(
    `Administrator(${message.author.toMention()}) executed command`,
    true
  );
});

async function modlog(msg: any, loginfoChannel: any = undefined) {
  if (loginfoChannel == undefined) {
    loginfoChannel = await discord.getGuildTextChannel(loginfoChannelID);
  }
  await loginfoChannel?.sendMessage(msg);
}

async function handleError(error: any, loginfochannel: any = undefined) {
  if (loginfochannel == undefined) {
    loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
  }
  if (error instanceof discord.ApiError) {
    await loginfochannel?.sendMessage(
      `\`\`\`javascript\n[ERROR] discord.ApiError caught: Code: ${error.code}\n` +
        `Endpoint: ${error.endpoint}\n` +
        `httpMethod: ${error.httpMethod}\n` +
        `httpStatus: ${error.httpStatus}\n` +
        `httpStatusText: ${error.httpStatusText}\n` +
        `message: ${error.message}\n` +
        `name: ${error.name}\n` +
        `stack: ${error.stack}\n \`\`\``
    );
  } else {
    await loginfochannel?.sendMessage(
      `\`\`\`javascript\n[ERROR] Generic Error caught: ${error}\n` +
        `type: ${typeof error}\n` +
        `message: ${error.message}\n` +
        `Error name: ${error.name}\n` +
        `stack: ${error.stack}\n \`\`\``
    );
  }
}

adminCommands.raw('removelevelroles', async (message) => {
  let start = Date.now(),
    polledUsersNo = 0,
    profiledUsersNo = 0;

  let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);

  try {
    let guild = await message.getGuild();
    const result = await pylon.requestCpuBurst(async () => {
      try {
        for await (const member of guild.iterMembers()) {
          polledUsersNo++;
          for (let levelrole in arrHoursLevels) {
            let index = member.roles.indexOf(
              arrHoursLevels[levelrole][1] as string
            );
            /*console.log(
          'levelrole:' +
            arrHoursLevels[levelrole][1] +
            ' - member.roles: ' +
            member.roles.toString() +
            ' - member: ' +
            member.user.getTag() +
            ' - index: ' +
            index
        );*/

            if (index != undefined && index >= 0) {
              await member.removeRole(arrHoursLevels[levelrole][1] as string);
              await loginfochannel!.sendMessage({
                content:
                  'Member <@!' +
                  member.user.id +
                  '> stripped of his role <@&' +
                  arrHoursLevels[levelrole][1] +
                  '>',
                allowedMentions: {},
              });
              profiledUsersNo++;
              break;
            }
          }
          //await member.addRole(arrHoursLevels[0][1] as string);
        }
      } catch (error) {
        await handleError(error, loginfochannel);
      }
    }, 5000);

    let stop = Date.now();
    await loginfochannel?.sendMessage(
      '```BurstCPU Result :\n' +
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
        '```\n' +
        'Profiled Data: Total exec time: `' +
        (stop - start).toString() +
        '` ns PolledUsers: `' +
        polledUsersNo +
        '` ProfiledUsers: `' +
        profiledUsersNo +
        '`'
    );
  } catch (err) {
    await handleError(err, loginfochannel);
  }
});

async function sendTopPicToChannel(
  replyChannel: discord.GuildTextChannel,
  loginfoChannel: discord.GuildTextChannel,
  what: number
) {
  await replyChannel.triggerTypingIndicator();
  let topMessageID = await getTopMessageID(what);
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
      tag: u?.getTag() || 'unknown#0000' /*,
            level: xpToLevel(entry.value as number),
            next: levelToXp(xpToLevel(entry.value as number) + 1),
            prev: levelToXp(xpToLevel(entry.value as number) - 1),
            avatar:
              user?.getAvatarUrl() ||
              'https://cdn.discordapp.com/embed/avatars/1.png'*/,
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
        top: JSON.stringify(top),
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Application 5f7a2a7297aadf69252889f6dc52da84`,
    },
    method: 'POST',
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
        data: await request.arrayBuffer(),
      },
    ],
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
    key: args.text(),
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
    json: args.text(),
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

function shouldWatchChannel(channel: discord.GuildVoiceChannel) {
  return channel == null ||
    channelCategoriesToWatch.indexOf(channel!.parentId!) == undefined ||
    channelCategoriesToWatch.indexOf(channel!.parentId!) == -1
    ? false
    : true;
}

function isCamSSOnlyChannelCategory(channel: discord.GuildVoiceChannel) {
  return channel == null ||
    channelCategoriesCamSSOnlyToWatchCheck.indexOf(channel!.parentId!) ==
      undefined ||
    channelCategoriesCamSSOnlyToWatchCheck.indexOf(channel!.parentId!) == -1
    ? false
    : true;
}

function shouldStopStudySession(
  newStateChannel: discord.GuildVoiceChannel,
  oldStateChannel: discord.GuildVoiceChannel,
  newState: discord.VoiceState,
  oldState: discord.VoiceState
) {
  if (!shouldWatchChannel(oldStateChannel)) return false;

  if (isCamSSOnlyChannelCategory(oldStateChannel)) {
    if (
      (oldState.selfVideo == true &&
        oldState.selfStream == false &&
        newState.selfVideo == false) || // Cam off
      (oldState.selfStream == true &&
        oldState.selfVideo == false &&
        newState.selfVideo == false) // Stream off
    )
      return true;
    else return false;
  }

  // Normal Channel (Silent Self Study/Cam/SS)
  return true;
}

function shouldStartStudySession(
  newStateChannel: discord.GuildVoiceChannel,
  oldStateChannel: discord.GuildVoiceChannel,
  newState: discord.VoiceState,
  oldState: discord.VoiceState
) {
  if (!shouldWatchChannel(newStateChannel)) return false;

  if (isCamSSOnlyChannelCategory(newStateChannel)) {
    if (
      (newState.selfVideo == true &&
        newState.selfStream == false &&
        oldState.selfStream == false) || // Cam on
      (newState.selfStream == true &&
        newState.selfVideo == false &&
        oldState.selfVideo == false) // Stream on
    )
      return true;
    else return false;
  }

  // Normal Channel (Silent Self Study/Cam/SS)
  return true;
}

discord.on('VOICE_STATE_UPDATE', async (newState, oldState) => {
  /*
  Case 1: Newly joins
  NewCHannel = study on Cam Channel
  Video / SS -> off
  
  Case 2: Already in channel
  OldChannell == NewCHannel == study on cam channel
  Video/SS -> Off

  when he Turn on CAMor SS & newChell = study on cam then off.
  */

  if (
    oldState.channelId == newState.channelId &&
    oldState.selfVideo == newState.selfVideo &&
    oldState.selfStream == newState.selfStream
  )
    return;

  let newStateChannel = await newState.getChannel()!;
  let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
  let memberinfochannel = await discord.getGuildTextChannel(channelId);
  let oldStateChannel = await oldState.getChannel()!;

  if (
    isCamSSOnlyChannelCategory(newStateChannel! as discord.GuildVoiceChannel) &&
    newState.selfVideo == false &&
    newState.selfStream == false
  ) {
    let guild = await discord.getGuild();
    let userid = newState.userId;
    let memeber = newState.member;
    //console.log('Setting Timout !');

    setTimeout(
      async ([guild, userid, memeber]) => {
        //console.log('function Called ! ' + userid + ':' + guild);
        let presentVoiceState = await discord
          .getGuild()
          .then((g) => g.getVoiceState(userid));
        //console.log('test 1');
        if (
          presentVoiceState!.selfStream == false &&
          presentVoiceState!.selfVideo == false &&
          isCamSSOnlyChannelCategory(
            (await presentVoiceState!.getChannel())! as discord.GuildVoiceChannel
          )
        ) {
          //console.log('test 1');
          (memeber as discord.GuildMember)!.edit({
            channelId: channelToSwitch,
          });

          let channelName = await (guild as discord.Guild)!
            .getChannel(channelToSwitch)
            .then((c) => c!.name);

          await memberinfochannel!.sendMessage(
            `${(
              memeber as discord.GuildMember
            ).toMention()} has been moved to :speaker: \`${channelName}\` for not using Cam or ScreenShare.`
          );
          await loginfochannel!.sendMessage({
            content: `${(memeber as discord.GuildMember).toMention()}(\`${(
              memeber as discord.GuildMember
            ).user.getTag()}\`) (\`${
              (memeber as discord.GuildMember).user.id
            }\`) has been moved to :speaker: \`${channelName}\` for not using Cam or ScreenShare.`,
            allowedMentions: {},
          });
        }
      },
      20000,
      guild,
      userid,
      memeber
    );
  }

  if (oldState.channelId != null) {
    if (
      shouldStopStudySession(
        newStateChannel! as discord.GuildVoiceChannel,
        oldStateChannel! as discord.GuildVoiceChannel,
        newState!,
        oldState!
      )
    ) {
      let tsJoined = (await betterKV.get<string>(
        newState.member.user.id,
        'TempTimes'
      ))!;

      let vcName = await discord
        .getGuildVoiceChannel(oldState.channelId)
        .then((c) => c!.name);
      //console.log(tsJoined);
      await betterKV.del(newState.member.user.id, 'TempTimes');

      let sztsTimeSessionSpent = (
        ((Date.now() - parseInt(tsJoined)) / (1000 * 60 * 60)) as number
      ).toFixed(2);

      if (isNaN(parseFloat(sztsTimeSessionSpent))) {
        await loginfochannel?.sendMessage(
          `**Error** Occred in Saving: \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying in :speaker:<#${oldState.channelId}> \`${vcName}\`:smiling_face_with_tear: @ ` + //has left the voice channel
            Date.now() +
            ',\ntsJoined:' +
            tsJoined +
            ',\nsztsTimeSessionSpent:' +
            sztsTimeSessionSpent
        );
        if (tsJoined == undefined) {
          await memberinfochannel?.sendMessage(
            `**Error** Occred in Saving: \`${newState.member.user.username}#${
              newState.member.user.discriminator
            }\` has stopped studying in <#${
              oldState.channelId
            }> :smiling_face_with_tear:. Study session stopped at \`${new Date().toLocaleString(
              undefined,
              {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'long',
                timeStyle: 'long',
              }
            )}\` and started at \`unknown\`.\nPlease contact Mods.` //has left the voice channel
          );
        } else {
          await memberinfochannel?.sendMessage(
            `**Error** Occred in Saving: \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying in <#${oldState.channelId}> :smiling_face_with_tear:. Please contact Mods.` //has left the voice channel
          );
        }
        return;
      }

      // TotalTimes Namespace- Saves Complete times
      let exits = await betterKV.exist(newState.member.user.id, 'TotalTimes');
      let totalTodayTime;
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
              `**Error** Occred in Saving (hrsOld[]): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying in :speaker:<#${oldState.channelId}> \`${vcName}\` :smiling_face_with_tear: @ ` + //has left the voice channel
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
              `**Error** Occred in Saving (hrsOld[]): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying in <#${oldState.channelId}> :smiling_face_with_tear: Please contact Mods.` //has left the voice channel
            );
            return;
          }

          let totalAllTime = (
            parseFloat(hrsOldArray[ALLTIME_DATA_INDEX]) +
            parseFloat(sztsTimeSessionSpent)
          ).toFixed(2);

          totalTodayTime = (
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
              `Error Occred in Saving (hrsOld): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying in :speaker:<#${oldState.channelId}> \`${vcName}\` :smiling_face_with_tear: @ ` + //has left the voice channel
                Date.now() +
                '\ntsJoined:' +
                tsJoined +
                ',\nsztsTimeSessionSpent:' +
                sztsTimeSessionSpent +
                ',\nhrsOld:' +
                hrsOld
            );

            await memberinfochannel?.sendMessage(
              `Error Occred in Saving (hrsOld): \`${newState.member.user.username}#${newState.member.user.discriminator}\` has stopped studying in <#${oldState.channelId}> :smiling_face_with_tear: Please contact Mods.` //has left the voice channel
            );
            return;
          }

          let totalAllTime = (
            parseFloat(hrsOld) + parseFloat(sztsTimeSessionSpent)
          ).toFixed(2);

          totalTodayTime = sztsTimeSessionSpent;

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
        totalTodayTime = sztsTimeSessionSpent;
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
        szExtTimeSpent +=
          Math.floor(flAdjTimeSpent) +
          (Math.floor(flAdjTimeSpent) >= 2 ? ' `hrs` ' : ' `hr` ');
      }

      let mins = (flAdjTimeSpent - Math.floor(flAdjTimeSpent)) * 60;
      szExtTimeSpent += mins.toFixed(1) + (mins >= 2 ? ' `mins`' : ' `min`');

      await loginfochannel?.sendMessage({
        content:
          `\`${newState.member.user.username}#${newState.member.user.discriminator}\` <@!${newState.member.user.id}> (${newState.member.user.id}) has stopped studying in :speaker:<#${oldState.channelId}> \`${vcName}\` :smiling_face_with_tear: @ ` + //has left the voice channel
          Date.now() +
          ` Time spent, *In this session*: ` +
          szExtTimeSpent /*sztsTimeSessionSpent +
          ' hrs'*/ +
          ' and *Today*: ' +
          totalTodayTime +
          ' `hrs`',
        allowedMentions: {},
      });

      await memberinfochannel?.sendMessage({
        content:
          `<@!${newState.member.user.id}>[\`${newState.member.user.username}#${newState.member.user.discriminator}\`] has stopped studying in <#${oldState.channelId}> :smiling_face_with_tear: ` + //has left the voice channel
          ` Time spent, *In this session*: ` +
          szExtTimeSpent /*sztsTimeSessionSpent +
          ' hrs'*/ +
          ' and *Today*: ' +
          totalTodayTime +
          ' `hrs`',
        allowedMentions: {},
      });

      await updateStickyTodayLB(memberinfochannel!);
    }
  }

  if (
    shouldStartStudySession(
      newStateChannel! as discord.GuildVoiceChannel,
      oldStateChannel! as discord.GuildVoiceChannel,
      newState!,
      oldState!
    )
  ) {
    let vcName = await discord
      .getGuildVoiceChannel(newState.channelId!)
      .then((c) => c!.name);
    //let channel = await discord.getGuildTextChannel(channelId);
    await loginfochannel?.sendMessage({
      content:
        `\`${newState.member.user.username}#${
          newState.member.user.discriminator
        }\` (${
          newState.member.user.id
        }) ${newState.member.user.toMention()} has started studying in :speaker: <#${
          newState.channelId
        }> \`${vcName}\` :smirk_cat: @ ` + Date.now(), //joined the voice channel
      allowedMentions: {},
    });
    await memberinfochannel?.sendMessage(
      `\`${newState.member.user.username}#${newState.member.user.discriminator}\` has started studying in <#${newState.channelId}> :smirk_cat: ` //joined the voice channel
    );

    let tsJoined = await betterKV.get<string>(
      newState.member.user.id,
      'TempTimes'
    );

    if (tsJoined != undefined) {
      let sztsTimeSessionSpent = (
        ((Date.now() - parseInt(tsJoined)) / (1000 * 60 * 60)) as number
      ).toFixed(2);

      let szExtTimeSpent = '';
      let flAdjTimeSpent = parseFloat(sztsTimeSessionSpent);
      if (flAdjTimeSpent > 1.0) {
        szExtTimeSpent +=
          Math.floor(flAdjTimeSpent) +
          (Math.floor(flAdjTimeSpent) >= 2 ? ' `hrs` ' : ' `hr` ');
      }

      let mins = (flAdjTimeSpent - Math.floor(flAdjTimeSpent)) * 60;
      szExtTimeSpent += mins.toFixed(1) + (mins >= 2 ? ' `mins`' : ' `min`');

      await loginfochannel?.sendMessage(
        `**Inconsistency** in database records: \`${newState.member.user.username}#${newState.member.user.discriminator}\` has started studying in :speaker:<#${newState.channelId}> \`${vcName}\` but the previous session started @${tsJoined} seems not added to studyTime :smiling_face_with_tear: ` + //has left the voice channel
          Date.now() +
          ',\ntsJoined:' +
          tsJoined +
          ',\n'
      );
      await memberinfochannel?.sendMessage(
        `**Inconsistency** in database records detected for \`${
          newState.member.user.username
        }#${
          newState.member.user.discriminator
        }\` for previous study session which started at \`${new Date(
          parseInt(tsJoined)
        ).toLocaleString(undefined, {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'long',
          timeStyle: 'long',
        })}\` and ended at \`unknown\` but before \`${new Date().toLocaleString(
          undefined,
          {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'long',
            timeStyle: 'long',
          }
        )}\` seems not added to studyTime :smiling_face_with_tear:.\nMax Time Inconsistency: ${szExtTimeSpent}. Please contact Mods.\nTrying to properly track present study session :white_check_mark:` //has left the voice channel
      );
    }

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
            allowedMentions: {},
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
      allowedMentions: {},
    });
    await loginfochannel.sendMessage({
      content:
        `\`${userObj.user.getTag()}\`(${
          userObj.user.id
        }) ${userObj.toMention()} has ranked up to Level: **` +
        toRole?.name +
        `** (${toRole?.toMention()})`,
      allowedMentions: {},
    });
  }
}

adminCommands.on(
  'testlvl',
  (args) => ({
    allTime: args.number(),
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

  //await loginfochannel?.triggerTypingIndicator();
  //await sleep(1300);

  await loginfochannel?.sendMessage('\t\tStarting **Daily Backup**...');
  try {
    const channel = await discord.getGuildTextChannel(topMessageChannelID);
    await testVar(
      channel,
      loginfochannel!,
      `Error: discord.getGuildTextChannel('${topMessageChannelID}') returned channel = `
    );

    let topMessage = await channel?.getMessage(
      await getTopMessageID(TODAY_DATA_INDEX)
    );
    await testVar(
      topMessage,
      loginfochannel!,
      `Error: channel?.getMessage('${await getTopMessageID(
        TODAY_DATA_INDEX
      )}') returned topMessage = `
    );

    const dataTodayTop = topMessage?.content!;
    await testVar(
      dataTodayTop,
      loginfochannel!,
      `Error: topMessage?.content returned dataTodayTop = `
    );

    topMessage = await channel?.getMessage(
      await getTopMessageID(ALLTIME_DATA_INDEX)
    );
    await testVar(
      topMessage,
      loginfochannel!,
      `Error: channel?.getMessage('${await getTopMessageID(
        ALLTIME_DATA_INDEX
      )}') returned topMessage = `
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

    //await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage('dataTodayTop, dataAllTimeTop ...');

    //await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage(dataTodayTop);

    //await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage(dataAllTimeTop);

    //await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage({
      content: '\n**Backup** Completed.\nPacked jsonKVs',
      attachments: [
        {
          name: 'bakupdata.txt',
          data: new TextEncoder().encode(jsonBackupString).buffer,
        },
      ],
    });
  } catch (error) {
    await handleError(error, loginfochannel);
  }
}

async function testVar(
  variable: any,
  loginfochannel: discord.GuildTextChannel,
  msg: string
) {
  if (variable == null || variable == undefined) {
    await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage(msg + variable);
  }
}

async function cron_task() {
  let topMessageID = await getTopMessageID(TODAY_DATA_INDEX);
  let msg = "*yesterday's* **LeaderBoard** \n\n";
  let logmsg = "*yesterday's* **LeaderBoard** \n\n";

  let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
  await loginfochannel?.sendMessage('**Cron Task** Starting....');

  try {
    await betterKV.del('resetedToday', 'MohaAdmin');
    await betterKV.save('dailyresettaskstart', Date.now(), 'MohaAdmin');

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

    let memberinfochannel = await discord.getGuildTextChannel(
      leaderboardchannel
    );
    await testVar(
      memberinfochannel,
      loginfochannel!,
      `Error: discord.getGuildTextChannel('${leaderboardchannel}') returned memberinfochannel = `
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
    //await memberinfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await memberinfochannel?.sendMessage(msg);
    //await sleep(1200);
    if (sendPictureTopTen) {
      await sendTopPicToChannel(
        memberinfochannel!,
        loginfochannel!,
        TODAY_DATA_INDEX
      );
    }

    //await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage({
      content: logmsg,
      allowedMentions: {},
    });

    let allKeys = await betterKV.getEntries('TotalTimes');
    await autoBackup(allKeys);

    //console.log(allKeys);
    //let value;
    const result = await pylon.requestCpuBurst(async () => {
      // your code
      for (let kv in allKeys) {
        //console.log(allKeys[kv]);
        //value = <string>await betterKV.get(allKeys[key], 'TotalTimes');
        /*if ((allKeys[kv][1] as string)!.indexOf(',') != -1) {
          console.log(
            parseFloat((allKeys[kv][1] as string).split(',')[1]) +
              ',' +
              typeof parseFloat((allKeys[kv][1] as string).split(',')[1]) +
              ',' +
              (allKeys[kv][1] as string).split(',')[1] +
              ',' +
              (allKeys[kv][1] as string).split(',') +
              ',' +
              (parseFloat((allKeys[kv][1] as string).split(',')[1]) != 0.0)
          );
        }*/
        if (
          (allKeys[kv][1] as string)!.indexOf(',') != -1 &&
          parseFloat((allKeys[kv][1] as string).split(',')[1]) != 0.0
        ) {
          // New DataScheme
          await betterKV.save(
            allKeys[kv][0],
            (allKeys[kv][1] as string).split(',')[0] + ',0',
            'TotalTimes'
          );
        }
      }
    }, 5000);

    //await sleep(1200);
    //await loginfochannel?.triggerTypingIndicator();
    //await sleep(1200);
    await loginfochannel?.sendMessage(
      'BurstCPU Result :\nbucketMaximumMs: ' +
        result.bucketMaximumMs +
        '\nbucketRemainingMs: ' +
        result.bucketRemainingMs +
        '\nbucketResetInMs: ' +
        result.bucketResetInMs +
        '\nresult: ' +
        result.result +
        '\nusedCpuMs: ' +
        result.usedCpuMs +
        '\n'
    );

    //loginfochannel?.sendMessage('LeaderboardData: ' + topMessage?.content!);
    await topMessage!.edit('{}');

    //await sleep(1200);
    //await loginfochannel!.triggerTypingIndicator();
    //await sleep(1200);
    await betterKV.save('resetedToday', '1', 'MohaAdmin');
    await betterKV.del('dailyresettaskstart', 'MohaAdmin');

    await loginfochannel!.sendMessage(
      "**Cron Task** Completed. Cleared Yesterday's Leaderboard."
    );
  } catch (error) {
    await handleError(error, loginfochannel);
  }
}

//IST 0330 HRS = UTC 2200 HRS <- Initial
//IST 0323 HRS = UTC 2153 HRS <- Updated to not to use :00 Min to de-load pylon bot's global rate-limits
pylon.tasks.cron('cron_task', '0 51 21 * * * *', async () => {
  await cron_task();
});

// +3 mins (180 secs) to the above task
/* --FailSafe 1--
 * Pylon will not throw any error if the execution failed due to its exeuction-limit passed
 * then usual finally() block will not work, hence this redundant task as failsafe is required
 */
pylon.tasks.cron('cron_task_failsafe1', '0 54 21 * * * *', async () => {
  await checkAndRestartDailyResetTask('**FailSafe 1**', true);
});

// +4 mins (240 secs) to the above task
/* --FailSafe 2-- */
pylon.tasks.cron('cron_task_failsafe2', '0 58 21 * * * *', async () => {
  await checkAndRestartDailyResetTask('**FailSafe 2**', true);
});

//DailyReset Task Statusus
const DAILY_TASK_SUCCESSFUL = 1;
const DAILY_TASK_RUNNING = 2;
const DAILY_TASK_FAILED = 3;

async function getDailyResetTaskStatus(): Promise<Number> {
  return new Promise<Number>(async (resolve, reject) => {
    let val = await betterKV.get('resetedToday', 'MohaAdmin');
    let startTimestamp = await betterKV.get<number>(
      'dailyresettaskstart',
      'MohaAdmin'
    );

    /*console.log(
      'sTS:' +
        startTimestamp +
        ' val:' +
        val +
        'type of val: ' +
        typeof val +
        ' (val == undefined): ' +
        (val == undefined)
    );*/

    if (startTimestamp != undefined) {
      // 30,000ms event function Execution MaxLimit of Pylon
      let taskExecTime = Date.now() - startTimestamp!;
      /*console.log(
        'Task Checking for DAILY_TASK_RUNNING taskExecTime:' + taskExecTime
      );*/
      if (taskExecTime < 31000) {
        //console.log('Task Statues : DAILY_TASK_RUNNING ');
        return resolve(DAILY_TASK_RUNNING);
      }
    }

    if (val == undefined) {
      //console.log('Task Statues : DAILY_TASK_FAILED');
      return resolve(DAILY_TASK_FAILED);
    } else if (val == '1') {
      //console.log('Task Statues : DAILY_TASK_SUCCESSFUL');
      return resolve(DAILY_TASK_SUCCESSFUL);
    }
  });
}

let lastUserInteraction: number = 0;

// will return True -> To block user interaction (Internal data is inconsistent like dailyLB not reset)
async function userInteraction(
  message: discord.GuildMemberMessage
): Promise<Boolean> {
  /*console.log(
    'Last Interaction: ' + (Date.now() - lastUserInteraction).toString()
  );*/

  if (Date.now() - lastUserInteraction < 700) {
    lastUserInteraction = Date.now();
    return new Promise<Boolean>((rs, rj) => rs(true)); // 700ms Spam protection
  }
  lastUserInteraction = Date.now();

  return new Promise<Boolean>(async (resolve, reject) => {
    try {
      let status = await getDailyResetTaskStatus();
      if (status == DAILY_TASK_FAILED) {
        await message.reply(
          'Its detected that the DailyStudyHours and/or DailyLeaderboard are not reset properly today. Initiated DailyReset. Please use the command after 2mins.' +
            message.author.toMention()
        );
        resolve(true);
        let ret = await checkAndRestartDailyResetTask(
          'DailyReset initiated by member: ' + message.author.toMention()
        );
      } else if (status == DAILY_TASK_RUNNING) {
        await message.reply(
          'DailyStudyHours and/or DailyLeaderboard are being reset. Please use the command after 2mins.' +
            message.author.toMention()
        );
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (err) {
      await handleError(err);
    }
  });
}

// will retrun true -> if dailyResetTask previous failed to run successfully and task is re-run
async function checkAndRestartDailyResetTask(
  extraInfo: string,
  log: Boolean = false
): Promise<Boolean> {
  return new Promise<Boolean>(async (resolve, reject) => {
    let loginfochannel = await discord.getGuildTextChannel(loginfoChannelID);
    try {
      let status = await getDailyResetTaskStatus();
      if (status == DAILY_TASK_FAILED) {
        await loginfochannel!.sendMessage(
          '@here DailyReset Task failed - restarting DailyReset Task. Info: ' +
            extraInfo
        );
        await cron_task();
        resolve(true);
      } else if (status == DAILY_TASK_RUNNING) {
        await loginfochannel!.sendMessage(
          'DailyReset Task is running. Info: ' + extraInfo
        );
        resolve(true);
      } else {
        if (log) {
          await loginfochannel!.sendMessage(
            'DailyReset Task successful - skipping restarting DailyReset Task. Info: ' +
              extraInfo
          );
        }
        resolve(false);
      }
    } catch (err) {
      await handleError(err, loginfochannel);
    }
  });
}
