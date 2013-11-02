window.version = '0.6'

window.our_log = (o) ->
    if window.console && console.log
        console.log.apply(console, if !!arguments.length then arguments else [this])
    else opera && opera.postError && opera.postError(o || this)

window.log_info = (o) -> log_msg("INFO", arguments)
window.log_warn = (o) -> log_msg("WARN", arguments)
window.log_error = (o) -> log_msg("ERROR", arguments)
window.log_debug = (o) ->
    log_msg("DEBUG", arguments) if window.debug?

# Our internal log allowing a log type
log_msg = (msg,rest) ->
    args = Array.prototype.slice.call(rest)
    r = [msg].concat(args)
    window.our_log.apply(window, r)

    return if msg=='DEBUG'

    $('.log-list').append("<pre class='#{msg.toLowerCase()}'>#{msg}: #{args}")
    if msg=='ERROR'
        $('.log-link').removeClass('btn-link')
        $('.log-link').addClass('btn-danger')
    if msg=='ERROR' || msg=='WARN'
        $('.log-link').css('opacity','1')


# This "scheduler" is designed to be used for tasks that may take some time, and
# will be called often.  For example, updating the heatmap, or datatable.
# It will schedule a given task after a set timeout, if the same task is re-scheduled before
# it is run, its schedule time will be reset
# Use: "schedule" for tasks that may be overwritten by later tasks
#      "schedule_now" for tasks that must not be skipped (these will run *now*)
class ScheduleTasks
    constructor: () ->
        @tasks = {}
        @interval = 100

    schedule: (lbl, func, interval=@interval) ->
        if @tasks[lbl]
            # Already a pending update.  Cancel it and re-schedule
            #msg_debug("clearing",lbl,@tasks[lbl].id)
            clearTimeout(@tasks[lbl].id)

        # No task pending.  add it, and schedule an update
        @tasks[lbl] =
            func: func
            id: setTimeout((() => @_runNow(lbl)), interval)
        #msg_debug("set",lbl,@tasks[lbl].id)

    # Used when an important task must run and not be overridden by later tasks
    schedule_now: (lbl, func) ->
        @tasks[lbl] =
            func: func
        @_runNow(lbl)

    _runNow: (lbl) ->
        task = @tasks[lbl]
        if task
            # Ensure there is still a task, may have been run by schedule_now()
            delete @tasks[lbl]
            #msg_debug("running",lbl,task.id)
            task.func()


window.scheduler = new ScheduleTasks()

# Convert any parameters in the pages url into a hash+array
window.get_url_vars = () ->
    vars = []
    hash = null
    hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
    for i in [0..hashes.length-1]
        hash = hashes[i].split('=')
        vars.push(hash[0])
        vars[hash[0]] = hash[1].replace(/\#$/,'')
    vars

window.setup_nav_bar = () ->
    about = $(require("../templates/about.hbs")(version: version))
    $('#about-modal').replaceWith(about)
    $("a.log-link").click(() -> $('.log-list').toggle())

    window.debug ?= get_url_vars()["debug"]