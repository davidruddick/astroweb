curl –request POST
–location
–data REQUEST=doQuery
–data PHASE=RUN
–data FORMAT=votable
–data LANG=ADQL
–data query="SELECT id2.id FROM ident AS id1 JOIN ident AS id2 USING(oidref) WHERE id1.id = 'M13';"
http://simbad.u-strasbg.fr/simbad/sim-tap/sync