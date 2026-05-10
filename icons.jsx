const Icon = ({name}) => <span aria-hidden="true" className="ico">{({dash:'▦',orders:'☑',team:'👥',req:'✉',stock:'▣',set:'⚙',rep:'📈',help:'?'})[name]||'•'}</span>;
